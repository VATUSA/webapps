import { hasAnyStaffAccess, normalizePermissionCollections } from "@/lib/acl"
import type { CobaltSession } from "@workspace/third-party/cobalt"

export function requireStaffSession(session: unknown): boolean {
  if (!session || typeof session !== "object") return false
  const s = session as {
    cobalt?: {
      global_permissions?: unknown
      facility_permissions?: unknown
    }
    global_permissions?: unknown
    facility_permissions?: unknown
  }
  const cobalt: Pick<Partial<CobaltSession>, "global_permissions" | "facility_permissions"> =
    (s.cobalt as
      | Pick<Partial<CobaltSession>, "global_permissions" | "facility_permissions">
      | undefined) ??
    ({
      global_permissions: s.global_permissions,
      facility_permissions: s.facility_permissions,
    } as Pick<
      Partial<CobaltSession>,
      "global_permissions" | "facility_permissions"
    >)

  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections({
      global_permissions: cobalt.global_permissions,
      facility_permissions: cobalt.facility_permissions,
    })

  return hasAnyStaffAccess({
    globalPermissions,
    facilityPermissions: allFacilityPermissions,
  })
}
