import { getEventById, getEventsPage } from "@workspace/third-party/cobalt"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import EventDeleteSuccessToast from "@/components/Events/EventDeleteSuccessToast"
import EventPreviewDialog from "@/components/Events/EventPreviewDialog"
import EventsIndex from "@/components/Events/EventsIndex"
import {
  ACTION,
  OBJECT,
  hasScopedPermission,
  normalizePermissionCollections,
} from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Manage Events",
  description: "Paginated event management with filtering by facility scope.",
})

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string; preview?: string }>
}

function parsePositiveInt(value: string | undefined) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export default async function ManageEventsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  const query = await searchParams
  const page = parsePositiveInt(query.page)
  const facilityId = id.trim().toUpperCase()
  const facilitySlug = facilityId.toLowerCase()

  const permissionCheck = await checkLivePermission({
    object: OBJECT.event,
    action: ACTION.write,
    facilityId,
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

  const isHq = facilityId === "ZHQ"

  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections(permissionCheck.liveSession)
  const canReviewEvents =
    isHq &&
    hasScopedPermission({
      globalPermissions,
      facilityPermissions: allFacilityPermissions,
      object: OBJECT.eventApproval,
      action: ACTION.write,
    })

  const cookieStore = await cookies()
  const cobaltCookie = cookieStore.get("vatusa-cobalt-token")?.value
  const items = await getEventsPage(page, facilityId, cobaltCookie)

  // Auto-open a preview of the just-created event (?preview=<id>). Fetch it by
  // id so it works even if the event isn't on the current page of the list.
  const previewId = Number(query.preview)
  const previewEvent =
    Number.isInteger(previewId) && previewId > 0
      ? await getEventById(previewId, cobaltCookie)
      : null

  return (
    <div className="flex flex-1 flex-col gap-4">
      <EventDeleteSuccessToast />
      {previewEvent ? (
        <EventPreviewDialog event={previewEvent} defaultOpen />
      ) : null}
      <EventsIndex
        items={items}
        page={page}
        facilityId={facilitySlug}
        canCreateEvent={!isHq}
        canEditEvent
        canDeleteEvent
        buildEditHref={
          isHq
            ? (item) =>
                `/facility/${(item.facility ?? "zhq").toLowerCase()}/events/${item.id}/edit`
            : undefined
        }
        canReviewEvents={canReviewEvents}
      />
    </div>
  )
}
