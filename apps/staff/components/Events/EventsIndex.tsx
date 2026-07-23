import Link from "next/link"
import type { CobaltEvent } from "@workspace/third-party/cobalt"
import { Card, CardContent } from "@workspace/ui/components/card"
import DeleteEventButton from "@/components/Events/DeleteEventButton"
import { deleteEventAction, reviewEventAction } from "@/actions/events"

// Must match cobalt's GetEventsPage recordsPerPage (src/endpoints/event.go).
const PAGE_SIZE = 25

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toUTCString()
}

function ReviewStatusBadge({ status }: { status?: string | null }) {
  if (!status) return <span className="text-muted-foreground">—</span>

  const variants: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }
  const cls = variants[status] ?? "bg-muted text-muted-foreground"
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  )
}

export default function EventsIndex({
  items,
  page,
  facilityId,
  canCreateEvent,
  canEditEvent,
  canDeleteEvent,
  canReviewEvents,
  newEventHref,
  buildEditHref,
}: {
  items: CobaltEvent[]
  page: number
  facilityId: string
  canCreateEvent: boolean
  canEditEvent?: boolean
  canDeleteEvent?: boolean
  canReviewEvents?: boolean
  newEventHref?: string
  buildEditHref?: (item: CobaltEvent) => string
}) {
  const hasPrevious = page > 1
  const hasNext = items.length === PAGE_SIZE
  const previousHref = `?page=${Math.max(1, page - 1)}`
  const nextHref = `?page=${page + 1}`
  const resolvedNewEventHref = newEventHref ?? `/facility/${facilityId}/events/new`
  const resolvedCanEditEvent = canEditEvent ?? canCreateEvent
  const resolvedCanDeleteEvent = canDeleteEvent ?? resolvedCanEditEvent

  return (
    <div className="space-y-4">
      {canCreateEvent ? (
        <div className="flex items-center justify-end">
          <Link
            href={resolvedNewEventHref}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            New Event
          </Link>
        </div>
      ) : null}

      {items.length === 0 ? (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No events found.
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
                    <th className="px-4 py-3">Facility</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Start</th>
                    <th className="px-4 py-3">End</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60">
                  {items.map((item) => (
                    <tr key={item.id} className="align-top">
                      <td className="px-4 py-4 font-medium text-foreground">{item.title}</td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {(item.facility ?? "-").toUpperCase()}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <ReviewStatusBadge status={item.review_status} />
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDateTime(item.start_timestamp)}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDateTime(item.end_timestamp)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {resolvedCanEditEvent ? (
                            <Link
                              href={
                                buildEditHref?.(item) ??
                                `/facility/${facilityId}/events/${item.id}/edit`
                              }
                              className="inline-flex h-8 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                            >
                              Edit
                            </Link>
                          ) : null}

                          {resolvedCanDeleteEvent ? (
                            <form action={deleteEventAction} className="inline-flex">
                              <input type="hidden" name="eventId" value={String(item.id)} />
                              <input type="hidden" name="facilityId" value={facilityId} />
                              <input
                                type="hidden"
                                name="returnTo"
                                value={`/facility/${facilityId}/events/manage?page=${page}`}
                              />
                              <DeleteEventButton itemTitle={item.title} />
                            </form>
                          ) : null}

                          {canReviewEvents && item.review_status === "pending" ? (
                            <>
                              <form action={reviewEventAction} className="inline-flex">
                                <input type="hidden" name="eventId" value={String(item.id)} />
                                <input type="hidden" name="status" value="approved" />
                                <button
                                  type="submit"
                                  className="inline-flex h-8 items-center justify-center rounded-md border border-green-600/60 bg-background px-3 text-sm font-medium text-green-700 transition-colors hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                >
                                  Approve
                                </button>
                              </form>
                              <form action={reviewEventAction} className="inline-flex">
                                <input type="hidden" name="eventId" value={String(item.id)} />
                                <input type="hidden" name="status" value="rejected" />
                                <button
                                  type="submit"
                                  className="inline-flex h-8 items-center justify-center rounded-md border border-red-600/60 bg-background px-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                  Reject
                                </button>
                              </form>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3">
        {hasPrevious ? (
          <Link
            href={previousHref}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Previous
          </Link>
        ) : (
          <span className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-muted/40 px-3 text-sm text-muted-foreground">
            Previous
          </span>
        )}

        {hasNext ? (
          <Link
            href={nextHref}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Next
          </Link>
        ) : (
          <span className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-muted/40 px-3 text-sm text-muted-foreground">
            Next
          </span>
        )}
      </div>
    </div>
  )
}
