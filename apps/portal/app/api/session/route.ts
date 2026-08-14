import { getCobaltSession } from "@/lib/auth"
import { NextResponse } from "next/server"

/**
 * Exposes the decoded cobalt session to the client.
 *
 * The navbar reads this instead of the root layout calling `cookies()`, which
 * would opt every route in the app out of static/ISR rendering. This is a local
 * JWT decode, not a cobalt round-trip.
 *
 * Must never be cached: the response is per-user. It is also excluded from the
 * Cloudflare cache rule.
 */
export async function GET() {
  const session = await getCobaltSession()

  return NextResponse.json(
    { session },
    { headers: { "Cache-Control": "private, no-store" } }
  )
}
