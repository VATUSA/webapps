import type { CobaltPermission, CobaltSession } from "@workspace/third-party/cobalt"

export const ACTION = {
  read: "read",
  write: "write",
  manageUnowned: "manage_unowned",
  usage: "usage",
} as const

export const OBJECT = {
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

export type NormalizedCobaltPermissions = {
  globalPermissions: CobaltPermission[]
  facilityPermissionsByFacility: Record<string, CobaltPermission[]>
  allFacilityPermissions: CobaltPermission[]
}

function norm(value: string | undefined) {
  return value?.trim().toLowerCase() ?? ""
}

function normFacility(value: string | undefined) {
  return value?.trim().toUpperCase() ?? ""
}

function isPermission(value: unknown): value is CobaltPermission {
  if (!value || typeof value !== "object") return false

  const candidate = value as Partial<CobaltPermission>
  return (
    typeof candidate.object === "string" &&
    candidate.object.trim().length > 0 &&
    typeof candidate.action === "string" &&
    candidate.action.trim().length > 0
  )
}

function normalizePermission(
  permission: CobaltPermission,
  facilityId?: string
): CobaltPermission {
  const facility = normFacility(permission.facility) || normFacility(facilityId)

  return {
    action: permission.action,
    object: permission.object,
    facility: facility || undefined,
  }
}

export function isSuperAdmin(perms: CobaltPermission[] | undefined): boolean {
  if (!Array.isArray(perms)) return false

  return perms.some((permission) => {
    return (
      norm(permission.object) === OBJECT.superadmin &&
      norm(permission.action) === ACTION.usage
    )
  })
}

type RawPermissionSource = Pick<
  Partial<CobaltSession>,
  "global_permissions" | "facility_permissions"
>

export function normalizePermissionCollections(
  source?: RawPermissionSource | null
): NormalizedCobaltPermissions {
  const globalPermissions = Array.isArray(source?.global_permissions)
    ? source.global_permissions.filter(isPermission).map((permission) =>
        normalizePermission(permission)
      )
    : []

  const facilityPermissionsByFacility: Record<string, CobaltPermission[]> = {}
  const allFacilityPermissions: CobaltPermission[] = []

  const rawFacilityPermissions = source?.facility_permissions

  if (Array.isArray(rawFacilityPermissions)) {
    for (const permission of rawFacilityPermissions) {
      if (!isPermission(permission)) continue

      const normalized = normalizePermission(permission)
      allFacilityPermissions.push(normalized)

      const facilityId = normFacility(normalized.facility)
      if (!facilityId) continue

      facilityPermissionsByFacility[facilityId] ??= []
      facilityPermissionsByFacility[facilityId].push(normalized)
    }
  } else if (rawFacilityPermissions && typeof rawFacilityPermissions === "object") {
    for (const [facilityKey, permissions] of Object.entries(rawFacilityPermissions)) {
      if (!Array.isArray(permissions)) continue

      const facilityId = normFacility(facilityKey)
      if (!facilityId) continue

      for (const permission of permissions) {
        if (!isPermission(permission)) continue

        const normalized = normalizePermission(permission, facilityId)
        facilityPermissionsByFacility[facilityId] ??= []
        facilityPermissionsByFacility[facilityId].push(normalized)
        allFacilityPermissions.push(normalized)
      }
    }
  }

  return {
    globalPermissions,
    facilityPermissionsByFacility,
    allFacilityPermissions,
  }
}

export function hasPermission(
  perms: CobaltPermission[] | undefined,
  object: string,
  action?: string
) {
  if (!Array.isArray(perms)) return false
  if (isSuperAdmin(perms)) return true
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

export function hasFacilityScopedPermission(input: {
  globalPermissions: CobaltPermission[]
  facilityPermissions: CobaltPermission[]
  facilityId: string
  object: string
  action?: string
  allowSuperAdmin?: boolean
}) {
  const globalPermissions = input.globalPermissions ?? []
  const facilityPermissions = input.facilityPermissions ?? []

  if (
    input.allowSuperAdmin !== false &&
    (isSuperAdmin(globalPermissions) || isSuperAdmin(facilityPermissions))
  ) {
    return true
  }

  return hasFacilityPermission(
    facilityPermissions,
    input.facilityId,
    input.object,
    input.action
  )
}

export function hasAnyFacilityScopedPermission(input: {
  globalPermissions: CobaltPermission[]
  facilityPermissions: CobaltPermission[]
  object: string
  action?: string
  allowSuperAdmin?: boolean
}) {
  const globalPermissions = input.globalPermissions ?? []
  const facilityPermissions = input.facilityPermissions ?? []
  const object = input.object
  const action = input.action

  if (
    input.allowSuperAdmin !== false &&
    (isSuperAdmin(globalPermissions) || isSuperAdmin(facilityPermissions))
  ) {
    return true
  }

  return facilityPermissions.some((permission) => {
    const facilityId = normFacility(permission.facility)
    if (!facilityId) return false

    return hasFacilityPermission(
      facilityPermissions,
      facilityId,
      object,
      action
    )
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
  allowSuperAdmin?: boolean
}) {
  const globalPermissions = input.globalPermissions ?? []
  const facilityPermissions = input.facilityPermissions ?? []
  const object = input.object
  const action = input.action
  const facilityId = input.facilityId

  if (
    input.allowSuperAdmin !== false &&
    (isSuperAdmin(globalPermissions) || isSuperAdmin(facilityPermissions))
  ) {
    return true
  }

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
  if (isSuperAdmin(allPermissions)) return true

  return allPermissions.some((p) => {
    const object = norm(p.object)

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
  canCreateEvent: boolean
  canCreateNews: boolean
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

  const canManageEvents = hasFacilityScopedPermission({
    globalPermissions,
    facilityPermissions,
    facilityId,
    object: OBJECT.event,
    action: ACTION.write,
    allowSuperAdmin: false,
  })

  const canManageAnyEvent = hasAnyFacilityScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.event,
    action: ACTION.write,
    allowSuperAdmin: false,
  })

  const canManageNews = hasPermission(
    globalPermissions,
    OBJECT.newsPost,
    ACTION.write
  )

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
    canCreateEvent:
      normFacility(facilityId) === "USA" ? canManageAnyEvent : canManageEvents,
    canCreateNews: canManageNews,
  }
}
