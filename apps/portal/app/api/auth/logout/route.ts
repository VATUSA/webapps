import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function GET() {
  const cookieStore = await cookies()
  cookieStore.set("pending-logout", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60,
    path: "/",
  })
  const cobaltBaseUrl =
    process.env.NEXT_PUBLIC_COBALT_EXTERNAL_BASE_URL ?? "http://localhost:8000/cobalt"
  redirect(`${cobaltBaseUrl}/login/logout`)
}
