import { getEventsPage } from "@workspace/third-party/cobalt"
import type { Metadata } from "next"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import EventDeleteSuccessToast from "@/components/Events/EventDeleteSuccessToast"
import EventsIndex from "@/components/Events/EventsIndex"
import {
  ACTION,
  OBJECT,
  hasPermission,
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
  searchParams: Promise<{ page?: string }>
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

  const { globalPermissions } = normalizePermissionCollections(
    permissionCheck.liveSession
  )
  const canReviewEvents =
    isHq && hasPermission(globalPermissions, OBJECT.eventApproval, ACTION.write)

  const allEvents = await getEventsPage(page)
  const items = isHq
    ? allEvents.filter((item) => item.review_status === "pending")
    : allEvents.filter((item) => item.facility?.toUpperCase() === facilityId)

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <EventDeleteSuccessToast />
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
    </main>
  )
}
