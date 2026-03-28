import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { cobalt, vatusa } from "@workspace/third-party"
import { cookies } from "next/headers"

/**
 * Callback from Cobalt's login flow. Used to store additional session data.
 *
 * Gets the Cobalt cookie from the request, uses it to make a server-side
 * request to Cobalt for the user's CID, uses that with the VATUSA API
 * to get some basic user information, and updates this app's session
 * with that data. Then redirects to the homepage.
 */
export async function GET() {
  const cookieStorage = await cookies()
  const cobaltCookie = cookieStorage.get("vatusa-cobalt-token")?.value

  if (cobaltCookie) {
    const cid = await cobalt.whoamiWithCookies(cobaltCookie)
    const cobaltInfo = await cobalt.getUserInfo(cobaltCookie)
    console.log(cobaltInfo) // TODO
    const info = await vatusa.getUserInfo(cid)

    const session = await getSession()
    session.isLoggedIn = true
    session.cid = cid
    session.name = `${info.data.fname} ${info.data.lname}`
    session.roles = info.data.roles
    await session.save()
  } else {
    // If the cookie is undefined, then either the login did not succeed, or this
    // route is getting the callback from cobalt after logging out. Regardless,
    // there should be no client-side cookie created for that.
    const session = await getSession()
    session.destroy()
  }

  redirect("/")
}
