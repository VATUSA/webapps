// requireStaffSession.ts
type CobaltPermission = { object?: string; action?: string }

export function requireStaffSession(session: unknown): boolean {
  if (!session || typeof session !== "object") return false
  const s = session as any
  const cobalt = s.cobalt ?? s

  const globalPermissions = Array.isArray(cobalt.global_permissions)
    ? cobalt.global_permissions
    : []
  const facilityPermissions = Array.isArray(cobalt.facility_permissions)
    ? cobalt.facility_permissions
    : []

  const perms = [...globalPermissions, ...facilityPermissions]

  if (perms.length === 0) return false

  const norm = (v?: unknown) =>
    typeof v === "string"
      ? v
          .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
          .replace(/[\s-]+/g, "_")
          .replace(/[^\w_]/g, "")
          .toLowerCase()
      : ""

  const staffObjects = new Set(
    [
      "system_api_role",
      "division_management_role",
      "division_staff_role",
      "facility_senior_staff_role",
      "facility_junior_staff_role",
      "facility_training_role",
      "event",
      "news_post",
      "user_sensitive_details",
    ].map(norm)
  )

  for (const p of perms) {
    if (!p || typeof p !== "object") continue
    const object = norm((p as CobaltPermission).object)
    const action = norm((p as CobaltPermission).action)

    // superadmin ACL shortcut
    if (object === "superadmin" && action === "usage") return true

    // any of these objects => staff access
    if (staffObjects.has(object)) return true
  }

  return false
}
