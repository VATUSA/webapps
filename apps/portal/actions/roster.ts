"use server"

import {
  getFacilityRoster,
  type CobaltFacilityRoster,
} from "@workspace/third-party/cobalt"
import { PUBLIC_CACHE } from "@/lib/cache"

export async function fetchFacilityRoster(
  facility: string
): Promise<CobaltFacilityRoster> {
  try {
    return await getFacilityRoster(facility, PUBLIC_CACHE)
  } catch (error) {
    console.error(`Server error fetching roster for ${facility}:`, error)
    return { home: [], visitors: [] }
  }
}
