"use server"

import {
  getUpcomingEvents,
  getEventById,
  type CobaltEvent,
} from "@workspace/third_party/cobalt"

export async function fetchUpcomingEvents(
  count: number = 5
): Promise<CobaltEvent[]> {
  try {
    const events = await getUpcomingEvents(count)
    return events
  } catch (error) {
    console.error("Server error fetching upcoming events:", error)
    throw error
  }
}

export async function fetchEventById(
  id: number | string
): Promise<CobaltEvent | null> {
  try {
    return await getEventById(id)
  } catch (error) {
    console.error(`Server error fetching event ${id}:`, error)
    return null
  }
}
