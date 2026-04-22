import { notFound } from "next/navigation"
import type { Metadata } from "next"
import EventForm from "@/components/Events/EventForm"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { fetchEventForEdit } from "@/actions/events"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Edit Event",
  description: "Update an existing event in the staff events area.",
})

type EditEventPageProps = {
  params: Promise<{
    id: string
    eventId: string
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id, eventId } = await params
  const facilityId = normalizeFacilityId(id)
  const parsedEventId = Number(eventId)

  if (!Number.isInteger(parsedEventId) || parsedEventId <= 0) {
    notFound()
  }

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

  const event = await fetchEventForEdit(parsedEventId)
  if (!event) {
    notFound()
  }

  const eventFacility = normalizeFacilityId(event.facility ?? "")
  if (!eventFacility || eventFacility !== facilityId) {
    notFound()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <EventForm mode="edit" facilityId={facilityId} event={event} />
    </main>
  )
}
