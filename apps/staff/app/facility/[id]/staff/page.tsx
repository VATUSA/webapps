import Link from "next/link"
import { Card, CardContent } from "@workspace/ui/components/card"
import type { Metadata } from "next"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { getUpcomingEvents } from "@workspace/third-party/cobalt"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Staff Dashboard",
  description: "Manage staff workflows and facility-specific operations.",
})

type StaffPageProps = {
  params: Promise<{
    id: string
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

export default async function Page({ params }: StaffPageProps) {
  const { id } = await params

  const facilityId = normalizeFacilityId(id)
  if (facilityId === "ZHQ") {
    redirect("/facility/zhq/division/events")
  }

  const upcomingEvents = await getUpcomingEvents(100)
  const facilityUpcomingCount = upcomingEvents.filter(
    (event) => normalizeFacilityId(event.facility ?? "") === facilityId
  ).length

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
            <BreadcrumbPage>Staff</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {facilityId} Staff
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage staff workflows and facility-specific operations.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="border-border/60">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground uppercase">
              Upcoming Events
            </p>
            <p className="text-2xl font-semibold">{facilityUpcomingCount}</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground uppercase">Facility</p>
            <p className="text-2xl font-semibold">{facilityId}</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground uppercase">Status</p>
            <p className="text-2xl font-semibold">Active</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardContent className="space-y-3 p-4">
          <h2 className="text-base font-semibold">Quick Actions</h2>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={`/facility/${id}/staff/events`}
              className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              View Events
            </Link>

            <Link
              href={`/facility/${id}/staff/tech`}
              className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Tech Config
            </Link>

            <Link
              href={`/facility/${id}/training`}
              className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Training
            </Link>

            <Link
              href={`/facility/${id}/staff-roles`}
              className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Staff POCs
            </Link>

            <Link
              href={`/facility/${id}/transfers`}
              className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Pending Transfers
            </Link>

            <Link
              href={`/facility/${id}/log`}
              className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              Action Log
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
