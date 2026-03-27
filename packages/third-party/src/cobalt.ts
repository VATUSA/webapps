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
 * Retrieve information about the user from Cobalt.
 *
 * @returns TODO
 */
export async function getUserInfo(cobaltCookie?: string): Promise<unknown> {
  if (!cobaltCookie) {
    return "-1"
  }
  const resp = await fetch(`${BASE_URL}my/session`, {
    headers: {
      Cookie: `vatusa-cobalt-token=${cobaltCookie}`,
    },
  })
  return await resp.json()
}
