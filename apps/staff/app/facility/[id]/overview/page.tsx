import Link from "next/link"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { getUpcomingEvents } from "@workspace/third-party/cobalt"

type OverviewPageProps = {
  params: Promise<{
    id: string
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

export default async function Page({ params }: OverviewPageProps) {
  const { id } = await params

  const facilityId = normalizeFacilityId(id)
  if (facilityId === "USA") {
    redirect("/facility/usa/division/events")
  }

  const facilitySlug = facilityId.toLowerCase()
  const isDivision = facilityId === "USA"

  const events = await getUpcomingEvents(100)
  const scopedEvents = isDivision
    ? events
    : events.filter(
        (event) => normalizeFacilityId(event.facility ?? "") === facilityId
      )

  const uniqueFacilities = new Set(
    scopedEvents
      .map((event) => normalizeFacilityId(event.facility ?? ""))
      .filter((f) => !!f)
  )

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
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isDivision ? "VATUSA Division Overview" : `${facilityId} Overview`}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isDivision
            ? "Division-level summary and quick links."
            : "Facility-level overview and quick links."}
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="border-border/60">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground uppercase">
              Upcoming Events
            </p>
            <p className="text-2xl font-semibold">{scopedEvents.length}</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground uppercase">
              {isDivision ? "Facilities With Events" : "Facility"}
            </p>
            <p className="text-2xl font-semibold">
              {isDivision ? uniqueFacilities.size : facilityId}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="space-y-1 p-4">
            <p className="text-xs text-muted-foreground uppercase">Scope</p>
            <p className="text-2xl font-semibold">
              {isDivision ? "Division" : "ARTCC"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardContent className="space-y-3 p-4">
          <h2 className="text-base font-semibold">Quick Actions</h2>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {isDivision ? (
              <>
                <Link
                  href={`/facility/${facilitySlug}/division/events`}
                  className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  Division Events
                </Link>
                <Link
                  href={`/facility/${facilitySlug}/staff`}
                  className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  Division Staff
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/facility/${facilitySlug}/staff`}
                  className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  Staff Dashboard
                </Link>
                <Link
                  href={`/facility/${facilitySlug}/staff/events`}
                  className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  Facility Events
                </Link>
                <Link
                  href={`/facility/${facilitySlug}/training`}
                  className="rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  Training
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
