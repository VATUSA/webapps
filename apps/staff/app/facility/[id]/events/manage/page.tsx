import { getEventsPage } from "@workspace/third-party/cobalt"
import type { Metadata } from "next"
import EventDeleteSuccessToast from "@/components/Events/EventDeleteSuccessToast"
import EventsIndex from "@/components/Events/EventsIndex"
import { getSession } from "@/lib/session"
import {
  ACTION,
  OBJECT,
  hasFacilityScopedPermission,
  normalizePermissionCollections,
} from "@/lib/acl"
import { createStaffPageMetadata } from "@/lib/metadata"

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

  const allEvents = await getEventsPage(page)
  const facilityId = id.toUpperCase()
  const session = await getSession()
  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections(session.cobalt)
  const canCreateEvent = hasFacilityScopedPermission({
    globalPermissions,
    facilityPermissions: allFacilityPermissions,
    object: OBJECT.event,
    action: ACTION.write,
    facilityId,
  })
  const items = allEvents.filter(
    (item) => item.facility?.toUpperCase() === facilityId
  )

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <EventDeleteSuccessToast />
      <EventsIndex
        items={items}
        page={page}
        facilityId={id.toLowerCase()}
        canCreateEvent={canCreateEvent}
      />
    </main>
  )
}
