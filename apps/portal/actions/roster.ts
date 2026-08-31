"use server"

import {
  getFacilityRoster,
  getFacilityStaff,
  type CobaltFacilityRoster,
  type CobaltFacilityStaff,
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

export async function fetchFacilityStaff(
  facility: string
): Promise<CobaltFacilityStaff> {
  try {
    return await getFacilityStaff(facility, PUBLIC_CACHE)
  } catch (error) {
    console.error(`Server error fetching staff for ${facility}:`, error)
    return { staff: [] }
  }
}
