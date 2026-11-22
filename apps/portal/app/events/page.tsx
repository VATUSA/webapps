import EventCalendar from "@/components/Events/EventCalendar/EventCalendar"
import {
  getEventsInRange,
  type CobaltEvent,
} from "@workspace/third-party/cobalt"
import { Metadata } from "next"
import { PUBLIC_CACHE } from "@/lib/cache"
import { calendarWindow } from "@/lib/event-calendar-window"

export const metadata: Metadata = {
  title: "Events Calendar | VATUSA",
  description: "Browse and explore upcoming VATUSA events",
}

// Keep in sync with PUBLIC_REVALIDATE_SECONDS in @/lib/cache — Next.js requires
// this to be a statically analyzable literal.
export const revalidate = 300

export default async function Page() {
  const range = calendarWindow()
  let events: CobaltEvent[] = []
  let loadedMonths: string[] = []

  try {
    events = await getEventsInRange(range.from, range.to, PUBLIC_CACHE)
    loadedMonths = range.months
  } catch (error) {
    // Leave loadedMonths empty so the calendar fetches each month itself
    // instead of showing months that failed to load as empty.
    console.error("Failed to load events calendar:", error)
  }

  return <EventCalendar events={events} loadedMonths={loadedMonths} />
}
