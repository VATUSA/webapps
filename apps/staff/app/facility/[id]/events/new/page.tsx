import EventForm from "@/components/Events/EventForm"
import type { Metadata } from "next"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import {
  ACTION,
  OBJECT,
} from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { buildStaffHomeHref } from "@/lib/navigation"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Create Event",
  description: "Create a new event in the staff events area.",
})

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const facilityId = id.toUpperCase()
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

  return (
    <div className="flex flex-1 flex-col gap-4">
      <EventForm mode="create" facilityId={facilityId} />
    </div>
  )
}
