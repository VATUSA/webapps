import Link from "next/link"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { CobaltEvent, getUpcomingEvents } from "@workspace/third-party/cobalt"

type EventsPageProps = {
  params: Promise<{
    id: string
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

function sortByStartAsc(a: CobaltEvent, b: CobaltEvent) {
  return (
    new Date(a.start_timestamp).getTime() -
    new Date(b.start_timestamp).getTime()
  )
}

function formatZulu(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date)

  return `${formatted}Z`
}

export default async function Page({ params }: EventsPageProps) {
  const { id } = await params
  const facilityId = normalizeFacilityId(id)
  const facilitySlug = facilityId.toLowerCase()

  const events = await getUpcomingEvents(100)
  const facilityEvents = events
    .filter((event) => normalizeFacilityId(event.facility ?? "") === facilityId)
    .sort(sortByStartAsc)

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
            <BreadcrumbPage>Events</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            {facilityId} Events
          </h1>
          <p className="text-sm text-muted-foreground">
            Upcoming events scoped to this facility.
          </p>
        </header>

        <Link
          href={`/facility/${facilitySlug}/staff/events/new`}
          className="inline-flex h-9 items-center justify-center rounded-md border border-transparent bg-primary px-4 text-sm font-medium whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          New Event
        </Link>
      </div>

      {facilityEvents.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No upcoming events for {facilityId}.
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/60">
                <thead className="bg-muted/40">
                  <tr className="text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Start</th>
                    <th className="px-4 py-3">End</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60">
                  {facilityEvents.map((event) => (
                    <tr key={event.id} className="align-top">
                      <td className="px-4 py-4">
                        <div className="font-medium text-foreground">
                          {event.title}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm whitespace-nowrap text-muted-foreground">
                        {formatZulu(event.start_timestamp)}
                      </td>

                      <td className="px-4 py-4 text-sm whitespace-nowrap text-muted-foreground">
                        {formatZulu(event.end_timestamp)}
                      </td>

                      <td className="px-4 py-4">
                        <p className="line-clamp-2 max-w-xl text-sm text-muted-foreground">
                          {event.body || "No description provided."}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/facility/${facilitySlug}/staff/events/${event.id}/edit`}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium whitespace-nowrap text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
