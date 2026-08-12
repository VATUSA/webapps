import type { CobaltAssignableRoles } from "@workspace/third-party/cobalt"

/** Facility key cobalt uses for division-wide (global) role assignments. */
export const GLOBAL_ROLE_FACILITY = "ZHQ"

export const ACE_TEAM_ROLE = "ace_team"

export type AssignableRoles = CobaltAssignableRoles["roles"]

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
