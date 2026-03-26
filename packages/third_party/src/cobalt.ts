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
  count: number = 10
): Promise<CobaltEvent[]> {
  const resp = await fetch(`${BASE_URL}event/upcoming/${count}`, {
    method: "GET",
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
