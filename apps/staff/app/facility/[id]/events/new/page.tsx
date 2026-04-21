import EventForm from "@/components/Events/EventForm"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import {
  ACTION,
  OBJECT,
  hasFacilityScopedPermission,
  normalizePermissionCollections,
} from "@/lib/acl"
import { EVENT_FACILITY_IDS } from "@/lib/facilities"
import { checkLivePermission } from "@/lib/auth"
import { buildStaffHomeHref } from "@/lib/navigation"

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const facilityId = id.toUpperCase()
  let allowedFacilityIds: string[] = []

  if (facilityId === "USA") {
    const permissionCheck = await checkLivePermission({
      object: OBJECT.event,
      action: ACTION.write,
      message: "You do not have live Cobalt permission to manage events for any facility.",
    })

    if (!permissionCheck.allowed || !permissionCheck.liveSession) {
      return (
        <UnauthorizedPanel
          message={permissionCheck.message}
          backHref={buildStaffHomeHref(facilityId)}
          toastMessage={permissionCheck.message}
        />
      )
    }

    const liveSession = permissionCheck.liveSession
    const { globalPermissions, allFacilityPermissions } =
      normalizePermissionCollections(liveSession)

    allowedFacilityIds = EVENT_FACILITY_IDS.filter((candidateFacilityId) =>
      hasFacilityScopedPermission({
        globalPermissions,
        facilityPermissions: allFacilityPermissions,
        object: OBJECT.event,
        action: ACTION.write,
        facilityId: candidateFacilityId,
        allowSuperAdmin: false,
      })
    )

    if (allowedFacilityIds.length === 0) {
      return (
        <UnauthorizedPanel
          message="You do not have live Cobalt permission to manage events for any facility."
          backHref={buildStaffHomeHref(facilityId)}
          toastMessage="You do not have live Cobalt permission to manage events for any facility."
        />
      )
    }
  } else {
    const permissionCheck = await checkLivePermission({
      object: OBJECT.event,
      action: ACTION.write,
      facilityId,
      requireFacility: true,
      allowGlobalFallback: false,
      allowSuperAdmin: false,
      message: `You do not have live Cobalt permission to manage events for ${facilityId}.`,
    })

    if (!permissionCheck.allowed) {
      return (
        <UnauthorizedPanel
          message={permissionCheck.message}
          backHref={buildStaffHomeHref(facilityId)}
          toastMessage={permissionCheck.message}
        />
      )
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <EventForm
        mode="create"
        facilityId={facilityId}
        allowedFacilityIds={allowedFacilityIds}
      />
    </main>
  )
}
