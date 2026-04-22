import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import EventForm from "@/components/Events/EventForm"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { fetchEventForEdit } from "@/actions/events"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Edit Event",
  description: "Update an existing facility event.",
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

export default async function Page({ params }: EditEventPageProps) {
  const { id, eventId } = await params
  const facilityId = normalizeFacilityId(id)
  const facilitySlug = facilityId.toLowerCase()

  const event = await fetchEventForEdit(eventId)
  if (!event) notFound()

  const eventFacilityId = normalizeFacilityId(event.facility ?? "")
  if (eventFacilityId !== facilityId) {
    notFound()
  }

  const permissionCheck = await checkLivePermission({
    object: OBJECT.event,
    action: ACTION.write,
    facilityId: eventFacilityId,
    message: `You do not have live Cobalt permission to manage events for ${eventFacilityId}.`,
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
    <main className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href={`/facility/${facilitySlug}/staff`} />}
            >
              Staff
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href={`/facility/${facilitySlug}/staff/events`} />}
            >
              Events
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Event</h1>
        <p className="text-sm text-muted-foreground">
          Update details for {event.title}.
        </p>
      </header>

      <EventForm mode="edit" facilityId={facilityId} event={event} />
    </main>
  )
}
