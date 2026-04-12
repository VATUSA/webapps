import type { CobaltPermission } from "@/lib/session"

const ACTION = {
  read: "read",
  write: "write",
  manageUnowned: "manage_unowned",
  usage: "usage",
} as const

const OBJECT = {
  superadmin: "superadmin",
  systemApiRole: "system_api_role",
  divisionManagementRole: "division_management_role",
  divisionStaffRole: "division_staff_role",
  facilitySeniorStaffRole: "facility_senior_staff_role",
  facilityJuniorStaffRole: "facility_junior_staff_role",
  facilityTrainingRole: "facility_training_role",
  event: "event",
  newsPost: "news_post",
  userSensitiveDetails: "user_sensitive_details",
} as const

const ACTION_IMPLIES: Record<string, readonly string[]> = {
  [ACTION.manageUnowned]: [ACTION.write, ACTION.read],
  [ACTION.write]: [ACTION.read],
}

function norm(value: string | undefined) {
  return value?.trim().toLowerCase() ?? ""
}

function normFacility(value: string | undefined) {
  return value?.trim().toUpperCase() ?? ""
}

function hasPermission(
  perms: CobaltPermission[] | undefined,
  object: string,
  action?: string
) {
  if (!Array.isArray(perms)) return false
  const obj = norm(object)
  const act = action ? norm(action) : ""

  return perms.some((p) => {
    const objectMatch = norm(p.object) === obj
    if (!objectMatch) return false
    if (!act) return true

    const userAction = norm(p.action)
    if (userAction === act) return true
    return ACTION_IMPLIES[userAction]?.includes(act) ?? false
  })
}

function hasFacilityPermission(
  perms: CobaltPermission[] | undefined,
  facilityId: string,
  object: string,
  action?: string
) {
  if (!Array.isArray(perms)) return false
  const fac = normFacility(facilityId)
  const obj = norm(object)
  const act = action ? norm(action) : ""

  return perms.some((p) => {
    const facilityMatch = normFacility(p.facility) === fac
    const objectMatch = norm(p.object) === obj
    if (!facilityMatch || !objectMatch) return false
    if (!act) return true

    const userAction = norm(p.action)
    if (userAction === act) return true
    return ACTION_IMPLIES[userAction]?.includes(act) ?? false
  })
}

export function hasScopedPermission(input: {
  globalPermissions: CobaltPermission[]
  facilityPermissions: CobaltPermission[]
  object: string
  action?: string
  facilityId?: string
  requireFacility?: boolean
  allowGlobalFallback?: boolean
}) {
  const globalPermissions = input.globalPermissions ?? []
  const facilityPermissions = input.facilityPermissions ?? []
  const object = input.object
  const action = input.action
  const facilityId = input.facilityId

  if (facilityId) {
    if (
      hasFacilityPermission(facilityPermissions, facilityId, object, action)
    ) {
      return true
    }

    if (input.requireFacility) return false
    if (input.allowGlobalFallback ?? true) {
      return hasPermission(globalPermissions, object, action)
    }

    return false
  }

  if (hasPermission(globalPermissions, object, action)) {
    return true
  }

  return facilityPermissions.some((p) => {
    const objectMatch = norm(p.object) === norm(object)
    if (!objectMatch) return false
    if (!action) return true

    const userAction = norm(p.action)
    const requiredAction = norm(action)
    if (userAction === requiredAction) return true
    return ACTION_IMPLIES[userAction]?.includes(requiredAction) ?? false
  })
}

export function hasAnyStaffAccess(input: {
  globalPermissions: CobaltPermission[]
  facilityPermissions: CobaltPermission[]
}) {
  const globalPermissions = input.globalPermissions ?? []
  const facilityPermissions = input.facilityPermissions ?? []

  const allPermissions = [...globalPermissions, ...facilityPermissions]
  return allPermissions.some((p) => {
    const object = norm(p.object)
    const action = norm(p.action)

    if (object === OBJECT.superadmin) {
      return action === ACTION.usage
    }

    return (
      object === OBJECT.systemApiRole ||
      object === OBJECT.divisionManagementRole ||
      object === OBJECT.divisionStaffRole ||
      object === OBJECT.facilitySeniorStaffRole ||
      object === OBJECT.facilityJuniorStaffRole ||
      object === OBJECT.facilityTrainingRole ||
      object === OBJECT.event ||
      object === OBJECT.newsPost ||
      object === OBJECT.userSensitiveDetails
    )
  })
}

export type StaffSidebarCapabilities = {
  canSeeOverview: boolean
  canSeeSrStaff: boolean
  canSeeArtccStaff: boolean
  canSeeTrainingStaff: boolean
  canSeeUsaOverview: boolean
  canSeeDivisionStaff: boolean
}

export function buildStaffSidebarCapabilities(input: {
  globalPermissions: CobaltPermission[]
  facilityPermissions: CobaltPermission[]
  facilityId: string
}): StaffSidebarCapabilities {
  const globalPermissions = input.globalPermissions ?? []
  const facilityPermissions = input.facilityPermissions ?? []
  const facilityId = input.facilityId

  const isSuperAdmin = hasScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.superadmin,
    action: ACTION.usage,
  })

  const isDivisionManagement = hasScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.divisionManagementRole,
  })
  const isDivisionStaff = hasScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.divisionStaffRole,
  })
  const isDivision = isDivisionManagement || isDivisionStaff

  const isFacilitySenior = hasScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.facilitySeniorStaffRole,
    facilityId,
  })

  const isFacilityJunior = hasScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.facilityJuniorStaffRole,
    facilityId,
  })

  const isFacilityTraining = hasScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.facilityTrainingRole,
    facilityId,
  })

  const canManageEvents = hasScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.event,
    action: ACTION.write,
    facilityId,
  })

  const canManageNews = hasScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.newsPost,
    action: ACTION.write,
    facilityId,
  })

  const hasStaffAccess = hasAnyStaffAccess({
    globalPermissions,
    facilityPermissions,
  })

  return {
    canSeeOverview: true,

    canSeeSrStaff: isSuperAdmin || isDivision || isFacilitySenior || canManageNews,

    canSeeArtccStaff:
      isSuperAdmin ||
      isDivision ||
      isFacilitySenior ||
      isFacilityJunior ||
      canManageEvents ||
      canManageNews,

    canSeeTrainingStaff:
      isSuperAdmin ||
      isDivision ||
      isFacilitySenior ||
      isFacilityJunior ||
      isFacilityTraining,

    // USA-specific visibility
    canSeeUsaOverview: isSuperAdmin || isDivision || hasStaffAccess,
    canSeeDivisionStaff: isSuperAdmin || isDivision,
  }
}
