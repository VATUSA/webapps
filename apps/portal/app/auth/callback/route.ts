import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { cobalt } from "@workspace/third-party"
import { cookies } from "next/headers"

/**
 * Cobalt auth callback handler (login and logout).
 *
 * This route finalizes authentication by reading the Cobalt auth cookie,
 * fetching identity/session data from Cobalt, enriching profile data from
 * the VATUSA API, and persisting everything into the shared iron-session.
 *
 * Persisted session fields include:
 * - `isLoggedIn`, `cid`, `name`
 * - legacy `roles` (for existing portal UI/features)
 * - canonical Cobalt payload (`session.cobalt`) used by ACL-aware apps
 *
 * Behavior:
 * - If `pending-logout` cookie exists: destroy session (logout path).
 * - If `vatusa-cobalt-token` exists: hydrate and save session (login path).
 * - If neither: destroy existing session (failed callback case).
 * - Always redirect to `/` when finished.
 */
export async function GET() {
  const cookieStorage = await cookies()

  const pendingLogout = cookieStorage.get("pending-logout")?.value
  if (pendingLogout) {
    const session = await getSession()
    session.destroy()
    cookieStorage.delete("pending-logout")
    redirect("/")
  }

  const cobaltCookie = cookieStorage.get("vatusa-cobalt-token")?.value

  if (cobaltCookie) {
    const cid = await cobalt.whoamiWithCookies(cobaltCookie)
    const cobaltInfo = await cobalt.getMySession(cobaltCookie)

    // Hydrate shared iron-session cookie used across apps.
    const session = await getSession()
    session.isLoggedIn = true
    session.cid = cid
    session.name = `${cobaltInfo.user.network_user.first_name} ${cobaltInfo.user.network_user.last_name}`
    session.roles = cobaltInfo.global_permissions.map((permission) => ({
      role: permission.object,
      facility: permission.facility ?? "",
    }))
    session.cobalt = cobaltInfo
    await session.save()
  } else {
    // No Cobalt cookie means auth did not complete or user logged out.
    // Remove app session to keep auth state consistent.
    const session = await getSession()
    session.destroy()
  }

  // Return user to homepage after callback processing.
  redirect("/")
}
