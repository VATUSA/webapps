import { getEventsInRange } from "@workspace/third-party/cobalt"
import { PUBLIC_CACHE, PUBLIC_REVALIDATE_SECONDS } from "@/lib/cache"
import { monthRange, parseMonthKey } from "@/lib/event-calendar-window"

/**
 * Approved events overlapping one UTC month ("YYYY-MM"), for the events
 * calendar to load months outside the window /events renders up front.
 *
 * A GET keyed by path (not a server action, which is a POST) so the response
 * can be cached at the CDN like the rest of the public portal. The cobalt read
 * also goes through the Data Cache via PUBLIC_CACHE.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ month: string }> }
) {
  const { month } = await params
  const monthStart = parseMonthKey(month)
  if (!monthStart) {
    return Response.json(
      { error: "month must be YYYY-MM within the supported range" },
      { status: 400, headers: { "cache-control": "no-store" } }
    )
  }

  const { from, to } = monthRange(monthStart)
  try {
    const events = await getEventsInRange(from, to, PUBLIC_CACHE)
    return Response.json(events, {
      headers: {
        "cache-control": `public, s-maxage=${PUBLIC_REVALIDATE_SECONDS}, stale-while-revalidate=${PUBLIC_REVALIDATE_SECONDS}`,
      },
    })
  } catch (error) {
    console.error(`Failed to load events for ${month}:`, error)
    return Response.json(
      { error: "Failed to load events" },
      { status: 502, headers: { "cache-control": "no-store" } }
    )
  }
}
