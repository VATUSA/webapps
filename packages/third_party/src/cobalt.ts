const BASE_URL = "http://localhost:8000/cobalt/"

/**
 * Call to the backend, using browser cookies, to get information
 * about the current authenticated user.
 *
 * This can only be used from the client; making a server-side call
 * from Next.js will not include the browser's cookies and therefore
 * cannot make this call. If accessing the auth'd user from the server
 * is required, we'll need to pass in cookies from the browser.
 *
 * @returns CID
 */
export async function whoami(): Promise<string> {
  return await (
    await fetch(`${BASE_URL}login/whoami`, {
      credentials: "include",
    })
  ).json()
}

/**
 * Using cookies from Next.js, call to Cobalt to see who is current authenticated.
 *
 * @returns CID
 */
export async function whoamiWithCookies(
  cobaltCookie?: string
): Promise<string> {
  if (!cobaltCookie) {
    return "-1"
  }
  const resp = await fetch(`${BASE_URL}login/whoami`, {
    headers: {
      Cookie: `vatusa-cobalt-token=${cobaltCookie}`,
    },
  })
  return await resp.json()
}

/**
 * Event type from Cobalt API
 */
export type CobaltEvent = {
  id: number
  title: string
  body?: string
  banner_image_url?: string
  facility?: string
  start_timestamp: string
  end_timestamp: string
}

/**
 * Fetch upcoming events from Cobalt API
 *
 * @param count - Number of upcoming events to fetch (default: 10)
 * @returns Array of upcoming events
 * @throws Error if the fetch fails
 */
export async function getUpcomingEvents(
  count: number = 5
): Promise<CobaltEvent[]> {
  const resp = await fetch(`${BASE_URL}event/upcoming/${count}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!resp.ok) {
    throw new Error(`Failed to fetch events: ${resp.statusText}`)
  }

  const data = await resp.json()
  return data || []
}

type CobaltErrorBody = {
  success?: boolean
  id?: number
  errors?: string[]
}

function isNoRowsNotFound(body: CobaltErrorBody | null): boolean {
  if (!body || body.success !== false || !Array.isArray(body.errors)) {
    return false
  }

  return body.errors.some((e) =>
    e.toLowerCase().includes("no rows in result set")
  )
}


export async function getEventById(
  id: number | string
): Promise<CobaltEvent | null> {
  const resp = await fetch(
    `${BASE_URL}event/${encodeURIComponent(String(id))}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (resp.status === 404) {
    return null
  }

  let body: unknown = null
  try {
    body = await resp.json()
  } catch {
    body = null
  }

  if (resp.status === 500 && isNoRowsNotFound(body as CobaltErrorBody | null)) {
    return null
  }

  if (!resp.ok) {
    throw new Error(`Failed to fetch event ${id}: ${resp.statusText}`)
  }

  return (body as CobaltEvent) ?? null
}


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

type CobaltNewsResponse =
  | CobaltNewsItem[]
  | {
      data?: CobaltNewsItem[]
      news?: CobaltNewsItem[]
      items?: CobaltNewsItem[]
    }

function extractNewsItems(payload: CobaltNewsResponse): CobaltNewsItem[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.data)) {
    return payload.data
  }

  if (Array.isArray(payload.news)) {
    return payload.news
  }

  if (Array.isArray(payload.items)) {
    return payload.items
  }

  return []
}

/**
 * Fetch paginated news from Cobalt API
 *
 * @param page - 1-based page number (default: 1)
 * @returns Array of news items
 * @throws Error if the fetch fails
 */
export async function getNewsPage(page: number = 1): Promise<CobaltNewsItem[]> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1

  const resp = await fetch(`${BASE_URL}news/page/${safePage}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!resp.ok) {
    throw new Error(`Failed to fetch news page ${safePage}: ${resp.statusText}`)
  }

  const body = (await resp.json()) as CobaltNewsResponse
  return extractNewsItems(body)
}

export async function getNewsPostById(
  id: number | string
): Promise<CobaltNewsItem | null> {
  const resp = await fetch(
    `${BASE_URL}news/post/${encodeURIComponent(String(id))}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (resp.status === 404) {
    return null
  }

  let body: unknown = null
  try {
    body = await resp.json()
  } catch {
    body = null
  }

  // Match current Cobalt "not found" behavior: 500 + no rows
  if (resp.status === 500 && isNoRowsNotFound(body as CobaltErrorBody | null)) {
    return null
  }

  if (!resp.ok) {
    throw new Error(`Failed to fetch news post ${id}: ${resp.statusText}`)
  }

  return (body as CobaltNewsItem) ?? null
}