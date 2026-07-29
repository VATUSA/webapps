"use server"

import {
  getAceTeam,
  type CobaltAceTeamMember,
} from "@workspace/third-party/cobalt"

export async function fetchAceTeam(): Promise<CobaltAceTeamMember[]> {
  try {
    return await getAceTeam()
  } catch (error) {
    console.error("Server error fetching ACE team:", error)
    return []
  }
}
