import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function GET() {
  const cookieStore = await cookies()

  const pendingLogout = cookieStore.get("pending-logout")?.value
  if (pendingLogout) {
    // Cobalt's logout clears vatusa-cobalt-token with Domain=vatusa.net, but the
    // login cookie is host-scoped (no Domain). Delete it ourselves so both are gone.
    cookieStore.delete("vatusa-cobalt-token")
    cookieStore.delete("pending-logout")
    redirect("/")
  }

  redirect("/")
}
