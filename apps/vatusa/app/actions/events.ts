"use server"

import {
  getUpcomingEvents,
  type CobaltEvent,
} from "@workspace/third_party/cobalt"

export async function fetchUpcomingEvents(
  count: number = 50
): Promise<CobaltEvent[]> {
  try {
    const events = await getUpcomingEvents(count)
    return events
  } catch (error) {
    console.error("Server error fetching upcoming events:", error)
    throw error
  }
}
