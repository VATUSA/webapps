import { CobaltPermission } from "./cobalt.js"

export const STAFF_PERMISSION_OBJECTS = new Set([
  "superadmin",
  "system_api_role",
  "division_management_role",
  "division_staff_role",
  "facility_senior_staff_role",
  "facility_junior_staff_role",
  "facility_training_role",
  "news_post",
  "event",
  "user_sensitive_details",
])

export function hasStaffAccess(perms: CobaltPermission[] | undefined): boolean {
  if (!Array.isArray(perms)) {
    return false
  }

  return perms.some(({ action, object }) => {
    const o = object?.toLowerCase() ?? ""
    const a = action?.toLowerCase() ?? ""

    if (o === "superadmin" && a === "usage") {
      return true
    }
    return STAFF_PERMISSION_OBJECTS.has(o)
  })
}
