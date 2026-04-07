import {cookies} from "next/headers.js";

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

function getBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_COBALT_BASE_URL ??
    process.env.COBALT_BASE_URL ??
    DEFAULT_BASE_URL

  return fromEnv.endsWith("/") ? fromEnv.slice(0, -1) : fromEnv
}

function toUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${getBaseUrl()}/${cleanPath}`
}

async function buildHeaders(options: CobaltRequestOptions): Promise<Headers> {
  const headers = new Headers(options.headers ?? {})

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const cookieStorage = await cookies()
  const cobaltCookie = cookieStorage.get("vatusa-cobalt-token")?.value
  if (cobaltCookie) {
    headers.set("Cookie", `vatusa-cobalt-token=${cobaltCookie}`)
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
    headers: await buildHeaders(options),
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

/**
 * First URL of the login flow. Used to redirect users from the frontend.
 */
export function getLoginUrl(): string {
  return `${getBaseUrl()}/login`
}

/**
 * Redirect users to this URL to clear their cobalt session.
 */
export function getLogoutUrl(): string {
  return `${getBaseUrl()}/login/logout`
}

export async function whoami(): Promise<string> {
  return cobaltRequest<string>("login/whoami", { method: "GET" })
}

export async function loginAs(cid: number | string): Promise<unknown> {
  return cobaltRequest<unknown>(`login/as/${encodeURIComponent(String(cid))}`, {
    method: "GET",
  })
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
  global_permissions: []
  facility_permissions: []
}

export async function getMySession(): Promise<CobaltSession> {
  return cobaltRequest<CobaltSession>("my/session", {
    method: "GET",
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

export async function getEventsPage(page = 1): Promise<CobaltEvent[]> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1
  return cobaltRequest<CobaltEvent[]>(`event/page/${safePage}`, {
    method: "GET",
  })
}

export async function getEventById(
  id: number | string
): Promise<CobaltEvent | null> {
  return cobaltRequestOrNull<CobaltEvent>(
    `event/${encodeURIComponent(String(id))}`,
    { method: "GET" }
  )
}

export async function createEvent(payload: CreateEventInput): Promise<unknown> {
  return cobaltRequest<unknown>("event/create", {
    method: "POST",
    body: payload,
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
