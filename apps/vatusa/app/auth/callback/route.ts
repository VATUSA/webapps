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
  const cobaltCookie = cookieStorage.get("vatusa-cobalt-token")
  const cid = await cobalt.whoamiWithCookies(cobaltCookie?.value)
  const cobaltInfo = await cobalt.getUserInfo(cobaltCookie?.value)
  console.log(cobaltInfo)

  // TODO use new cobalt endpoint for getting user info

  const info = await vatusa.getUserInfo(cid)

  const session = await getSession()
  session.isLoggedIn = true
  session.cid = cid
  session.name = `${info.data.fname} ${info.data.lname}`
  session.roles = info.data.roles
  await session.save()

  redirect("/")
}
