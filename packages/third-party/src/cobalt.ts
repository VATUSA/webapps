const DEFAULT_BASE_URL = "http://localhost:8000/cobalt"

export type CobaltRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
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

function buildHeaders(options: CobaltRequestOptions): Headers {
  const headers = new Headers(options.headers ?? {})

  if (options.body !== undefined && !headers.has("Content-Type")) {
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

  const resp = await fetch(url, {
    method,
    cache: options.cache ?? "no-store",
    credentials: options.credentials ?? "include",
    headers: buildHeaders(options),
    body:
      options.body === undefined
        ? undefined
        : typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body),
    signal: options.signal,
    next: options.next,
  })

  const body = await parseResponseBody(resp)

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

export async function getAceTeam(): Promise<CobaltAceTeamMember[]> {
  return cobaltRequest<CobaltAceTeamMember[]>("roles/ace-team", {
    method: "GET",
  })
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

export async function getUpcomingEvents(count = 5): Promise<CobaltEvent[]> {
  const safeCount = Number.isInteger(count) && count > 0 ? count : 5
  return cobaltRequest<CobaltEvent[]>(`event/upcoming/${safeCount}`, {
    method: "GET",
  })
}

export async function getEventsPage(
  page = 1,
  facility?: string,
  cobaltCookie?: string
): Promise<CobaltEvent[]> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1
  const query = facility ? `?facility=${encodeURIComponent(facility)}` : ""
  return cobaltRequest<CobaltEvent[]>(`event/page/${safePage}${query}`, {
    method: "GET",
    cobaltCookie,
    credentials: cobaltCookie ? "omit" : undefined,
  })
}

export async function getEventById(
  id: number | string,
  cobaltCookie?: string
): Promise<CobaltEvent | null> {
  return cobaltRequestOrNull<CobaltEvent>(
    `event/${encodeURIComponent(String(id))}`,
    { method: "GET", cobaltCookie, credentials: cobaltCookie ? "omit" : undefined }
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

export async function getNewsPage(page = 1): Promise<CobaltNewsItem[]> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1
  const raw = await cobaltRequest<CobaltNewsResponseEnvelope>(
    `news/page/${safePage}`,
    { method: "GET" }
  )
  return extractNewsItems(raw)
}

export async function getNewsPosts(count = 20): Promise<CobaltNewsItem[]> {
  const safeCount = Number.isInteger(count) && count > 0 ? count : 20
  const raw = await cobaltRequest<CobaltNewsResponseEnvelope>(
    `news/${safeCount}`,
    { method: "GET" }
  )
  return extractNewsItems(raw)
}

export async function getNewsPostById(
  id: number | string
): Promise<CobaltNewsItem | null> {
  return cobaltRequestOrNull<CobaltNewsItem>(
    `news/post/${encodeURIComponent(String(id))}`,
    { method: "GET" }
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
  facility: string
): Promise<CobaltFacilityRoster> {
  return cobaltRequest<CobaltFacilityRoster>(
    `roster/${encodeURIComponent(facility.toUpperCase())}`,
    { method: "GET" }
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
