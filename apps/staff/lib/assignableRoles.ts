import { cookies } from "next/headers"
import {
  getMyAssignableRoles,
  type CobaltAssignableRoles,
} from "@workspace/third-party/cobalt"

/** Facility key cobalt uses for division-wide (global) role assignments. */
export const GLOBAL_ROLE_FACILITY = "ZHQ"

export const ACE_TEAM_ROLE = "ace_team"

export type AssignableRoles = CobaltAssignableRoles["roles"]

const EMPTY: AssignableRoles = {}

/**
 * Fetches the roles the current user may grant/revoke. Fails closed: any error
 * (missing cookie, cobalt down, endpoint absent) yields an empty map, so every
 * assignment-gated surface hides rather than opening up on a failed lookup.
 */
export async function fetchAssignableRoles(): Promise<AssignableRoles> {
  const cookieStore = await cookies()
  const cobaltCookie = cookieStore.get("vatusa-cobalt-token")?.value
  if (!cobaltCookie) return EMPTY

  try {
    const result = await getMyAssignableRoles(cobaltCookie)
    return result?.roles ?? EMPTY
  } catch (error) {
    console.error("Failed to fetch assignable roles:", error)
    return EMPTY
  }
}

export function canAssignRole(
  assignableRoles: AssignableRoles | undefined,
  facility: string,
  role: string
): boolean {
  const roles = assignableRoles?.[facility.trim().toUpperCase()]
  if (!Array.isArray(roles)) return false

  return roles.some((candidate) => candidate.trim() === role)
}

export function canManageAceTeam(
  assignableRoles: AssignableRoles | undefined
): boolean {
  return canAssignRole(assignableRoles, GLOBAL_ROLE_FACILITY, ACE_TEAM_ROLE)
}
