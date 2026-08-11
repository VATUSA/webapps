import EventCalendar from "@/components/Events/EventCalendar/EventCalendar"
import {
  getUpcomingEvents,
  type CobaltEvent,
} from "@workspace/third-party/cobalt"
import { Metadata } from "next"
import { PUBLIC_CACHE } from "@/lib/cache"

export const metadata: Metadata = {
  title: "Events Calendar | VATUSA",
  description: "Browse and explore upcoming VATUSA events",
}

// Keep in sync with PUBLIC_REVALIDATE_SECONDS in @/lib/cache — Next.js requires
// this to be a statically analyzable literal.
export const revalidate = 300

export default async function Page() {
  let events: CobaltEvent[] = []

  try {
    events = await getUpcomingEvents(50, PUBLIC_CACHE)
  } catch (error) {
    console.error("Failed to load events calendar:", error)
  }

  return <EventCalendar events={events} />
}
