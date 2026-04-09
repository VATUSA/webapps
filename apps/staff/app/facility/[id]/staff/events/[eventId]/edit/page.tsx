import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import EventForm from "@/components/Events/EventForm"
import { fetchEventForEdit } from "@/actions/events"

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

  if (normalizeFacilityId(event.facility ?? "") !== facilityId) {
    notFound()
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
