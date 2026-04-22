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
import {
  ACTION,
  OBJECT,
} from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { buildStaffHomeHref } from "@/lib/navigation"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Create Event",
  description: "Create a new event for this facility.",
})

type NewEventPageProps = {
  params: Promise<{
    id: string
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

export default async function Page({ params }: NewEventPageProps) {
  const { id } = await params
  const facilityId = normalizeFacilityId(id)
  const facilitySlug = facilityId.toLowerCase()
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
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Create Event</h1>
        <p className="text-sm text-muted-foreground">
          Create a new event for {facilityId}.
        </p>
      </header>

      <EventForm mode="create" facilityId={facilityId} />
    </main>
  )
}
