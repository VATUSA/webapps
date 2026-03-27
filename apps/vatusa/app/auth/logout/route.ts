import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"

/**
 * Clear this app's session data, and then redirect to the Cobalt logout route.
 */
export async function GET() {
  const session = await getSession()
  session.destroy()

  redirect("/cobalt/login/logout")
}
