import type { CobaltPermission } from "@/lib/session"

const ACTION = {
  read: "read",
  write: "write",
  manageUnowned: "manage_unowned",
  usage: "usage",
} as const

const OBJECT = {
  superadmin: "superadmin",
  divisionManagementRole: "division_management_role",
  divisionStaffRole: "division_staff_role",
  facilitySeniorStaffRole: "facility_senior_staff_role",
  facilityJuniorStaffRole: "facility_junior_staff_role",
  facilityTrainingRole: "facility_training_role",
} as const

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
    return norm(p.action) === act
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
    return norm(p.action) === act
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

  const isSuperAdmin = hasPermission(
    globalPermissions,
    OBJECT.superadmin,
    ACTION.usage
  )

  const isDivisionManagement = hasPermission(
    globalPermissions,
    OBJECT.divisionManagementRole
  )
  const isDivisionStaff = hasPermission(
    globalPermissions,
    OBJECT.divisionStaffRole
  )
  const isDivision = isDivisionManagement || isDivisionStaff

  const isFacilitySenior =
    hasFacilityPermission(
      facilityPermissions,
      facilityId,
      OBJECT.facilitySeniorStaffRole
    ) || hasPermission(globalPermissions, OBJECT.facilitySeniorStaffRole)

  const isFacilityJunior =
    hasFacilityPermission(
      facilityPermissions,
      facilityId,
      OBJECT.facilityJuniorStaffRole
    ) || hasPermission(globalPermissions, OBJECT.facilityJuniorStaffRole)

  const isFacilityTraining =
    hasFacilityPermission(
      facilityPermissions,
      facilityId,
      OBJECT.facilityTrainingRole
    ) || hasPermission(globalPermissions, OBJECT.facilityTrainingRole)

  return {
    canSeeOverview: true,

    canSeeSrStaff: isSuperAdmin || isDivision || isFacilitySenior,

    canSeeArtccStaff:
      isSuperAdmin || isDivision || isFacilitySenior || isFacilityJunior,

    canSeeTrainingStaff:
      isSuperAdmin ||
      isDivision ||
      isFacilitySenior ||
      isFacilityJunior ||
      isFacilityTraining,

    // USA-specific visibility
    canSeeUsaOverview: isSuperAdmin || isDivision,
    canSeeDivisionStaff: isSuperAdmin || isDivision,
  }
}
