import type {
  CobaltPermission,
  CobaltSession,
} from "@workspace/third-party/cobalt"

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
  eventApproval: "event_approval",
  newsPost: "news_post",
  userSensitiveDetails: "user_sensitive_details",
  facilityTechConfig: "facility_tech_config",
  policy: "policy",
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
    ? source.global_permissions
        .filter(isPermission)
        .map((permission) => normalizePermission(permission))
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
  } else if (
    rawFacilityPermissions &&
    typeof rawFacilityPermissions === "object"
  ) {
    for (const [facilityKey, permissions] of Object.entries(
      rawFacilityPermissions
    )) {
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
}) {
  return hasScopedPermission({
    globalPermissions: input.globalPermissions ?? [],
    facilityPermissions: input.facilityPermissions ?? [],
    object: input.object,
    action: input.action,
    facilityId: input.facilityId,
  })
}

export function hasAnyFacilityScopedPermission(input: {
  globalPermissions: CobaltPermission[]
  facilityPermissions: CobaltPermission[]
  object: string
  action?: string
}) {
  const globalPermissions = input.globalPermissions ?? []
  const facilityPermissions = input.facilityPermissions ?? []
  const object = input.object
  const action = input.action
  const requiredObject = norm(object)
  const requiredAction = action ? norm(action) : ""

  if (isSuperAdmin(globalPermissions)) return true
  if (hasPermission(globalPermissions, object, action)) return true

  return facilityPermissions.some((permission) => {
    if (!normFacility(permission.facility)) return false
    if (norm(permission.object) !== requiredObject) return false
    if (!requiredAction) return true

    const userAction = norm(permission.action)
    if (userAction === requiredAction) return true
    return ACTION_IMPLIES[userAction]?.includes(requiredAction) ?? false
  })
}

export function hasScopedPermission(input: {
  globalPermissions: CobaltPermission[]
  facilityPermissions: CobaltPermission[]
  object: string
  action?: string
  facilityId?: string
}) {
  const globalPermissions = input.globalPermissions ?? []
  const facilityPermissions = input.facilityPermissions ?? []
  const object = input.object
  const action = input.action
  const facilityId = input.facilityId

  if (isSuperAdmin(globalPermissions)) return true
  if (hasPermission(globalPermissions, object, action)) return true

  if (facilityId) {
    return hasFacilityPermission(
      facilityPermissions,
      facilityId,
      object,
      action
    )
  }

  return facilityPermissions.some((p) => {
    if (!normFacility(p.facility)) return false
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

  if (isSuperAdmin(globalPermissions)) return true
  const allPermissions = [...globalPermissions, ...facilityPermissions]

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
  })

  const canManageNews = hasScopedPermission({
    globalPermissions,
    facilityPermissions,
    facilityId,
    object: OBJECT.newsPost,
    action: ACTION.write,
  })

  const hasStaffAccess = hasAnyStaffAccess({
    globalPermissions,
    facilityPermissions,
  })

  return {
    canSeeOverview: true,

    canSeeSrStaff:
      isSuperAdmin || isDivision || isFacilitySenior || canManageNews,

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

    // Headquarters-specific visibility
    canSeeUsaOverview: isSuperAdmin || isDivision || hasStaffAccess,
    canSeeDivisionStaff: isSuperAdmin || isDivision,
    canCreateEvent: canManageEvents,
    canCreateNews: canManageNews,
  }
}
