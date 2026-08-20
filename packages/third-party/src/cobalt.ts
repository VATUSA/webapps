const DEFAULT_BASE_URL = "http://localhost:8000/cobalt"

/**
 * Node's fetch (undici) defaults to a 300s headers timeout and a 300s body
 * timeout. That is effectively unbounded on an SSR render path: a backend that
 * accepts the connection and then stalls holds the request — and whatever
 * server component awaited it — for five minutes.
 *
 * This is hardening, not an incident fix. Cobalt was confirmed healthy and
 * sub-10ms through the crash windows we investigated, so this is not what was
 * killing portal pods. It bounds the failure mode for the next time a backend
 * does go slow, which is worth having on its own terms.
 *
 * Override per-request with `timeoutMs`, or globally with the
 * COBALT_REQUEST_TIMEOUT_MS env var so it can be tuned from the ConfigMap
 * without a rebuild.
 */
const DEFAULT_TIMEOUT_MS = 8_000

function resolveTimeoutMs(explicit?: number): number {
  if (explicit !== undefined) return explicit

  const raw = process.env.COBALT_REQUEST_TIMEOUT_MS
  if (!raw) return DEFAULT_TIMEOUT_MS

  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS
}

export type CobaltRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
  /** Overrides DEFAULT_TIMEOUT_MS / COBALT_REQUEST_TIMEOUT_MS for this call. */
  timeoutMs?: number
  cache?: RequestCache
  credentials?: RequestCredentials
  next?: NextFetchRequestConfig
  /**
   * Raw cobalt cookie value (without cookie name).
   * Adds: Cookie: vatusa-cobalt-token=<value>
   */
  cobaltCookie?: string
  /**
   * Optional bearer token if your backend accepts it.
   */
  bearerToken?: string
}

/**
 * Opt-in caching for public read endpoints.
 *
 * Caching is off by default: `cobaltRequest` sends `no-store` unless a caller
 * asks otherwise. Callers that render public, non-personalized content (the
 * portal) pass a `revalidate` to let the response into the Next.js Data Cache,
 * which in turn lets the route be prerendered and cached at the CDN.
 */
export type CobaltCacheOptions = {
  /** Seconds before the entry is revalidated. Omitted or `false` means no caching. */
  revalidate?: number | false
}

/**
 * Resolves cache options for a public GET.
 *
 * Invariant: a request carrying a `cobaltCookie` is scoped to one user (e.g.
 * staff viewing unapproved events) and is never cached, regardless of what the
 * caller asked for.
 */
function readCache(
  tags: string[],
  cache?: CobaltCacheOptions,
  cobaltCookie?: string
): Pick<CobaltRequestOptions, "cache" | "next"> {
  const revalidate = cache?.revalidate

  if (cobaltCookie || revalidate === undefined || revalidate === false) {
    return { cache: "no-store" }
  }

  return { next: { revalidate, tags } }
}

export class CobaltHttpError extends Error {
  status: number
  statusText: string
  url: string
  body: unknown

  constructor(input: {
    message: string
    status: number
    statusText: string
    url: string
    body: unknown
  }) {
    super(input.message)
    this.name = "CobaltHttpError"
    this.status = input.status
    this.statusText = input.statusText
    this.url = input.url
    this.body = input.body
  }
}

/**
 * Thrown when *our* timeout fires. A caller-supplied signal aborting is that
 * caller's business and propagates untouched, so `instanceof` here always means
 * "the backend was too slow", never "someone cancelled".
 *
 * Distinct from CobaltHttpError because a timeout has no status, no body, and
 * no response — and because callers currently catch CobaltHttpError to map 404s
 * to null, which a timeout must not be folded into.
 */
export class CobaltTimeoutError extends Error {
  url: string
  method: string
  timeoutMs: number

  constructor(input: {
    url: string
    method: string
    timeoutMs: number
    cause?: unknown
  }) {
    super(
      `Cobalt request timed out after ${input.timeoutMs}ms (${input.method} ${input.url})`,
      { cause: input.cause }
    )
    this.name = "CobaltTimeoutError"
    this.url = input.url
    this.method = input.method
    this.timeoutMs = input.timeoutMs
  }
}

type CobaltErrorBody = {
  success?: boolean
  id?: number
  errors?: string[]
}

export function isNoRowsNotFound(body: unknown): boolean {
  if (!body || typeof body !== "object") return false

  const b = body as CobaltErrorBody
  if (b.success !== false || !Array.isArray(b.errors)) return false

  return b.errors.some((e) =>
    String(e).toLowerCase().includes("no rows in result set")
  )
}

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

/**
 * Used for server-side cobalt API calls.
 * Prefer internal-only hostnames here when available.
 */
function getApiBaseUrl(): string {
  const fromEnv = process.env.COBALT_INTERNAL_BASE_URL ?? DEFAULT_BASE_URL

  return normalizeBaseUrl(fromEnv)
}

function toUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${getApiBaseUrl()}/${cleanPath}`
}

/** Body types fetch can send as-is, rather than being JSON-encoded. */
function isPassthroughBody(body: unknown): body is BodyInit {
  return typeof body === "string" || body instanceof FormData
}

function buildHeaders(options: CobaltRequestOptions): Headers {
  const headers = new Headers(options.headers ?? {})

  // FormData bodies are left alone: fetch has to set Content-Type itself so it
  // can include the multipart boundary.
  if (
    options.body !== undefined &&
    !isPassthroughBody(options.body) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json")
  }

  if (options.cobaltCookie) {
    headers.set("Cookie", `vatusa-cobalt-token=${options.cobaltCookie}`)
  }

  if (options.bearerToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${options.bearerToken}`)
  }

  return headers
}

async function parseResponseBody(resp: Response): Promise<unknown> {
  const contentType = resp.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    return await resp.json()
  }

  // Fallback for text/plain or unknown payloads
  const txt = await resp.text()
  return txt.length ? txt : null
}

export async function cobaltRequest<T>(
  path: string,
  options: CobaltRequestOptions = {}
): Promise<T> {
  const url = toUrl(path)
  const method = options.method ?? "GET"
  const timeoutMs = resolveTimeoutMs(options.timeoutMs)

  // Composed rather than replacing options.signal, so caller cancellation still
  // works. The body read is inside the try as well as the fetch: undici aborts
  // the response stream when the signal fires, so a backend that sends headers
  // and then stalls mid-body is bounded too, not just a slow connect.
  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeoutSignal])
    : timeoutSignal

  // Uncached by default, so nothing is accidentally shared between users. A
  // caller that opts in via `next.revalidate` must not have that overridden
  // back to `no-store` here, or the route can never be prerendered.
  const wantsRevalidate = typeof options.next?.revalidate === "number"
  const cache = options.cache ?? (wantsRevalidate ? undefined : "no-store")

  let resp: Response
  let body: unknown

  try {
    resp = await fetch(url, {
      method,
      cache,
      credentials: options.credentials ?? "include",
      headers: buildHeaders(options),
      body:
        options.body === undefined
          ? undefined
          : isPassthroughBody(options.body)
            ? options.body
            : JSON.stringify(options.body),
      signal,
      next: options.next,
    })

    body = await parseResponseBody(resp)
  } catch (error) {
    if (timeoutSignal.aborted && !options.signal?.aborted) {
      // webapps-prod pods have no log shipping, so this line only survives if
      // someone is watching the container — but it is the one signal that says
      // "the backend was too slow" rather than a generic failure in a caller's
      // catch block. Same msg-keyed shape as the diagnostics in
      // apps/portal/instrumentation.ts so it greps alongside them.
      console.error(
        JSON.stringify({
          msg: "cobalt_request_timeout",
          method,
          url,
          timeoutMs,
        })
      )

      throw new CobaltTimeoutError({ url, method, timeoutMs, cause: error })
    }

    throw error
  }

  if (!resp.ok) {
    throw new CobaltHttpError({
      message: `Cobalt request failed (${resp.status} ${resp.statusText}) at ${url}`,
      status: resp.status,
      statusText: resp.statusText,
      url,
      body,
    })
  }

  return body as T
}

/**
 * Returns null for:
 * - 404
 * - 500 + { success: false, errors: ["...no rows in result set..."] }
 */
export async function cobaltRequestOrNull<T>(
  path: string,
  options: CobaltRequestOptions = {}
): Promise<T | null> {
  try {
    return await cobaltRequest<T>(path, options)
  } catch (err) {
    if (err instanceof CobaltHttpError) {
      if (err.status === 404) return null
      if (err.status === 500 && isNoRowsNotFound(err.body)) return null
    }
    throw err
  }
}

/* ============================================================================
 * Auth / Session
 * ========================================================================== */

export async function whoami(): Promise<string> {
  return cobaltRequest<string>("login/whoami", { method: "GET" })
}

export async function whoamiWithCookies(
  cobaltCookie?: string
): Promise<string> {
  if (!cobaltCookie) {
    throw Error("Missing Cobalt cookie")
  }

  return cobaltRequest<string>("login/whoami", {
    method: "GET",
    cobaltCookie,
    credentials: "omit",
  })
}

export async function loginAs(cid: number | string): Promise<unknown> {
  return cobaltRequest<unknown>(`login/as/${encodeURIComponent(String(cid))}`, {
    method: "GET",
  })
}

export type CobaltPermission = {
  action: string
  object: string
  facility?: string
}

export type CobaltNetworkUser = {
  first_name: string
  last_name: string
  email: string
  rating: number
  region: string
  division: string
  subdivision: string
  pilot_rating: number
  military_rating: number
}

export type CobaltDivisionUser = {
  display_name: string | null
  controller_rating: number
  instructor_rating: number
  facility: string
  visiting_facilities: string[]
  discord_id: string | null
  last_promotion_timestamp: number
  last_transfer_timestamp: number
}

export type CobaltSessionUser = {
  cid: number
  network_user: CobaltNetworkUser
  division_user: CobaltDivisionUser
}

export type CobaltSession = {
  user: {
    cid: number
    network_user: {
      first_name: string
      last_name: string
      email: string
      rating: number
      region: string
      division: string
      subdivision: string
      pilot_rating: number
      military_rating: number
    }
    division_user: {
      display_name: string
      controller_rating: number
      instructor_rating: number
      facility: string
      visiting_facilities: []
      discord_id: null
      last_promotion_timestamp: null
      last_transfer_timestamp: null
    }
  }
  global_permissions: CobaltPermission[]
  facility_permissions:
    | CobaltPermission[]
    | Record<string, CobaltPermission[]>
}

export async function getMySession(
  cobaltCookie?: string
): Promise<CobaltSession> {
  if (!cobaltCookie) {
    throw Error("Missing Cobalt cookie")
  }

  return cobaltRequest<CobaltSession>("my/session", {
    method: "GET",
    cobaltCookie,
    credentials: "omit",
  })
}

/* ============================================================================
 * Users / Tokens / Roles
 * ========================================================================== */

export type CobaltUser = {
  cid?: number
  [key: string]: unknown
}

export async function getUserByCid(cid: number | string): Promise<CobaltUser> {
  return cobaltRequest<CobaltUser>(`user/${encodeURIComponent(String(cid))}`, {
    method: "GET",
  })
}

export type GenerateUserTokenResponse = {
  token?: string
  [key: string]: unknown
}

export async function generateUserToken(
  cid: number | string
): Promise<GenerateUserTokenResponse> {
  return cobaltRequest<GenerateUserTokenResponse>(
    `token/${encodeURIComponent(String(cid))}`,
    { method: "GET" }
  )
}

export type LegacyRole = {
  facility: string
  role: string
}

export type LegacySyncRolesInput = {
  cid: number
  roles: LegacyRole[]
}

export async function legacySyncRoles(
  payload: LegacySyncRolesInput
): Promise<unknown> {
  return cobaltRequest<unknown>("roles/legacy_sync", {
    method: "POST",
    body: payload,
  })
}

export type CobaltAceTeamMember = {
  cid: number
  name: string
  rating: number
  rating_short: string
}
export type CobaltAssignableRoles = {
  roles: Record<string, string[]>
}

export async function getMyAssignableRoles(
  cobaltCookie?: string
): Promise<CobaltAssignableRoles> {
  return cobaltRequest<CobaltAssignableRoles>("my/roles/assignable", {
    method: "GET",
    cobaltCookie,
    credentials: cobaltCookie ? "omit" : undefined,
  })
}

export async function getAceTeam(): Promise<CobaltAceTeamMember[]> {
  return cobaltRequest<CobaltAceTeamMember[]>("roles/ace-team", {
    method: "GET",
  })
}

export async function grantUserRole(
  cid: number | string,
  facility: string,
  role: string,
  cobaltCookie?: string
): Promise<unknown> {
  return cobaltRequest<unknown>(
    `user/${encodeURIComponent(String(cid))}/role/${encodeURIComponent(
      facility
    )}`,
    {
      method: "POST",
      body: { role },
      cobaltCookie,
      credentials: cobaltCookie ? "omit" : undefined,
    }
  )
}

export type CobaltUserNetworkDetails = {
  first_name: string | null
  last_name: string | null
  email: string | null
  rating: number
  region: string
  division: string
  subdivision: string | null
  pilot_rating: number
  military_rating: number
}

export type CobaltUserDivisionDetails = {
  display_name: string
  controller_rating: number
  instructor_rating: number
  facility: string
  visiting_facilities: string[]
  discord_id: string | null
  last_promotion_timestamp: number | null
  last_transfer_timestamp: number | null
}

export type CobaltUserSearchResult = {
  cid: number
  network_user: CobaltUserNetworkDetails | null
  division_user: CobaltUserDivisionDetails | null
}


export async function searchUsers(
  query: string,
  limit = 5,
  cobaltCookie?: string
): Promise<CobaltUserSearchResult[]> {
  const params = new URLSearchParams({ q: query, limit: String(limit) })

  return cobaltRequest<CobaltUserSearchResult[]>(
    `user/search?${params.toString()}`,
    {
      method: "GET",
      cobaltCookie,
      credentials: cobaltCookie ? "omit" : undefined,
    }
  )
}

export async function revokeUserRole(
  cid: number | string,
  facility: string,
  role: string,
  cobaltCookie?: string
): Promise<unknown> {
  return cobaltRequest<unknown>(
    `user/${encodeURIComponent(String(cid))}/role/${encodeURIComponent(
      facility
    )}/${encodeURIComponent(role)}`,
    {
      method: "DELETE",
      cobaltCookie,
      credentials: cobaltCookie ? "omit" : undefined,
    }
  )
}

/* ============================================================================
 * Events
 * ========================================================================== */

export type CobaltEvent = {
  id: number
  title: string
  body?: string
  banner_image_url?: string
  facility?: string
  start_timestamp: string
  end_timestamp: string
  review_status?: string | null
  reviewed_by?: number | null
  reviewed_on?: number | null
}

export type CreateEventInput = {
  title: string
  body: string
  banner_image_url?: string
  facility: string
  start_timestamp: string
  end_timestamp: string
}

export async function getUpcomingEvents(
  count = 5,
  cache?: CobaltCacheOptions
): Promise<CobaltEvent[]> {
  const safeCount = Number.isInteger(count) && count > 0 ? count : 5
  return cobaltRequest<CobaltEvent[]>(`event/upcoming/${safeCount}`, {
    method: "GET",
    ...readCache(["events"], cache),
  })
}

export async function getEventsPage(
  page = 1,
  facility?: string,
  cobaltCookie?: string,
  cache?: CobaltCacheOptions
): Promise<CobaltEvent[]> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1
  const query = facility ? `?facility=${encodeURIComponent(facility)}` : ""
  return cobaltRequest<CobaltEvent[]>(`event/page/${safePage}${query}`, {
    method: "GET",
    cobaltCookie,
    credentials: cobaltCookie ? "omit" : undefined,
    ...readCache(["events"], cache, cobaltCookie),
  })
}

export async function getEventById(
  id: number | string,
  cobaltCookie?: string,
  cache?: CobaltCacheOptions
): Promise<CobaltEvent | null> {
  return cobaltRequestOrNull<CobaltEvent>(
    `event/${encodeURIComponent(String(id))}`,
    {
      method: "GET",
      cobaltCookie,
      credentials: cobaltCookie ? "omit" : undefined,
      ...readCache(["events", `events:${id}`], cache, cobaltCookie),
    }
  )
}

export async function reviewEvent(
  id: number | string,
  status: "approved" | "rejected",
  cobaltCookie: string
): Promise<unknown> {
  return cobaltRequest<unknown>(`event/${encodeURIComponent(String(id))}/review`, {
    method: "POST",
    body: { status },
    cobaltCookie,
    credentials: "omit",
  })
}

export async function createEvent(
  payload: CreateEventInput,
  cobaltCookie?: string
): Promise<unknown> {
  return cobaltRequest<unknown>("event/create", {
    method: "POST",
    body: payload,
    cobaltCookie,
    credentials: cobaltCookie ? "omit" : undefined,
  })
}

/* ============================================================================
 * News
 * ========================================================================== */

export type CobaltNewsItem = {
  id: number
  title: string
  body?: string
  author_cid?: number
  post_timestamp?: number
  post_date?: string
  created_timestamp?: string
  updated_timestamp?: string
}

type CobaltNewsResponseEnvelope =
  | CobaltNewsItem[]
  | {
      data?: CobaltNewsItem[]
      news?: CobaltNewsItem[]
      items?: CobaltNewsItem[]
    }

function extractNewsItems(
  payload: CobaltNewsResponseEnvelope
): CobaltNewsItem[] {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.news)) return payload.news
  if (Array.isArray(payload.items)) return payload.items
  return []
}

export type CreateNewsPostInput = {
  title: string
  body: string
}

export type UpdateNewsPostInput = Partial<CreateNewsPostInput>

export async function getNewsPage(
  page = 1,
  cache?: CobaltCacheOptions
): Promise<CobaltNewsItem[]> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1
  const raw = await cobaltRequest<CobaltNewsResponseEnvelope>(
    `news/page/${safePage}`,
    { method: "GET", ...readCache(["news"], cache) }
  )
  return extractNewsItems(raw)
}

export async function getNewsPosts(
  count = 20,
  cache?: CobaltCacheOptions
): Promise<CobaltNewsItem[]> {
  const safeCount = Number.isInteger(count) && count > 0 ? count : 20
  const raw = await cobaltRequest<CobaltNewsResponseEnvelope>(
    `news/${safeCount}`,
    { method: "GET", ...readCache(["news"], cache) }
  )
  return extractNewsItems(raw)
}

export async function getNewsPostById(
  id: number | string,
  cache?: CobaltCacheOptions
): Promise<CobaltNewsItem | null> {
  return cobaltRequestOrNull<CobaltNewsItem>(
    `news/post/${encodeURIComponent(String(id))}`,
    { method: "GET", ...readCache(["news", `news:${id}`], cache) }
  )
}

export async function createNewsPost(
  payload: CreateNewsPostInput
): Promise<unknown> {
  return cobaltRequest<unknown>("news/new", {
    method: "POST",
    body: payload,
  })
}

/**
 * Bruno shows POST /news/post/:id for update.
 * If Cobalt expects a body, pass payload.
 */
export async function updateNewsPost(
  id: number | string,
  payload?: UpdateNewsPostInput
): Promise<unknown> {
  return cobaltRequest<unknown>(`news/post/${encodeURIComponent(String(id))}`, {
    method: "POST",
    body: payload,
  })
}

export async function deleteNewsPost(id: number | string): Promise<unknown> {
  return cobaltRequest<unknown>(`news/post/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  })
}

export type CobaltRosterUser = {
  cid: number
  network_user: {
    first_name: string
    last_name: string
    email: string
    rating: number
    region: string
    division: string
    subdivision: string
    pilot_rating: number
    military_rating: number
  }
  division_user: {
    display_name: string | null
    controller_rating: number
    instructor_rating: number
    facility: string
    visiting_facilities: string[]
    discord_id: string | null
    last_promotion_timestamp: number | null
    last_transfer_timestamp: number | null
  }
}

export type CobaltFacilityRoster = {
  home: CobaltRosterUser[]
  visitors: CobaltRosterUser[] | null
}

export async function getFacilityRoster(
  facility: string,
  cache?: CobaltCacheOptions
): Promise<CobaltFacilityRoster> {
  const safeFacility = facility.toUpperCase()
  return cobaltRequest<CobaltFacilityRoster>(
    `roster/${encodeURIComponent(safeFacility)}`,
    {
      method: "GET",
      ...readCache(["roster", `roster:${safeFacility}`], cache),
    }
  )
}

export type CobaltV3ApiKey = {
  id: number
  code: string
  testing: boolean
  facility: string | null
  created_at: number
  updated_at: number | null
}

export async function getFacilityApiKeys(
  facility: string,
  cobaltCookie?: string
): Promise<CobaltV3ApiKey[]> {
  return cobaltRequest<CobaltV3ApiKey[]>(
    `facility/${encodeURIComponent(facility.toUpperCase())}/v3/apikeys`,
    { method: "GET", cobaltCookie, credentials: cobaltCookie ? "omit" : undefined }
  )
}

/* ============================================================================
 * JWT decoding
 * ========================================================================== */

export type CobaltJwtPayloadInternal = {
  cid: number
  display_name: string
  facility_permissions: string // comma-separated "facility:object:action"
  global_permissions: string   // comma-separated "object:action"
  is_staff: boolean
  home_facility: string
}

export type CobaltJwtPayload = {
  cid: number
  display_name: string
  facility_permissions: CobaltPermission[]
  global_permissions: CobaltPermission[]
  is_staff: boolean
  home_facility: string
}

export function transformCobaltJwt(
  decoded: CobaltJwtPayloadInternal
): CobaltJwtPayload {
  return {
    ...decoded,
    is_staff: decoded.is_staff ?? false,
    home_facility: decoded.home_facility ?? "",
    facility_permissions: decoded.facility_permissions
      .split(",")
      .filter((s) => s.length > 0)
      .map((s): CobaltPermission => ({
        facility: s.split(":")[0]!,
        object: s.split(":")[1]!,
        action: s.split(":")[2]!,
      })),
    global_permissions: decoded.global_permissions
      .split(",")
      .filter((s) => s.length > 0)
      .map((s): CobaltPermission => ({
        facility: "*",
        object: s.split(":")[0]!,
        action: s.split(":")[1]!,
      })),
  }
}

export async function decodeCobaltJwt(
  cookieStore: { get(name: string): { value: string } | undefined }
): Promise<CobaltJwtPayload | null> {
  const token = cookieStore.get("vatusa-cobalt-token")?.value
  if (!token) return null
  try {
    const { decodeJwt } = await import("jose")
    const decoded = decodeJwt<CobaltJwtPayloadInternal>(token)
    return transformCobaltJwt(decoded)
  } catch {
    return null
  }
}
