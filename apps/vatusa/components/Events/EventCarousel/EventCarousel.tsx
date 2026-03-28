import Link from "next/link"
import { Card, CardContent } from "@workspace/ui/components/card"
import { type CobaltEvent } from "@workspace/third_party/cobalt"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel"

type EventCarouselProps = {
  events: CobaltEvent[]
}

function formatZulu(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date)

  return `${formatted}Z`
}

function EventSlide({ event }: { event: CobaltEvent }) {
  return (
    <CarouselItem key={event.id}>
      <Link
        href={`/events/${event.id}`}
        className="block p-1 focus-visible:outline-none"
        aria-label={`Open event: ${event.title}`}
      >
        <Card className="overflow-hidden border-border/60 pt-0 transition-colors duration-150 hover:border-border hover:bg-accent/20">
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            {event.banner_image_url ? (
              <>
                <img
                  src={event.banner_image_url}
                  alt={event.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                No Banner
              </div>
            )}
          </div>

          <CardContent className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-base font-semibold text-foreground">
                {event.title}
              </h3>
              {event.facility ? (
                <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {event.facility}
                </span>
              ) : null}
            </div>

            <p className="text-xs text-muted-foreground">
              {formatZulu(event.start_timestamp)} -{" "}
              {formatZulu(event.end_timestamp)}
            </p>
          </CardContent>
        </Card>
      </Link>
    </CarouselItem>
  )
}

export function EventCarousel({ events }: EventCarouselProps) {
  if (!events.length) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Card className="border-border/60">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No upcoming events right now.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Carousel className="mx-auto w-full max-w-6xl px-12 sm:px-14">
      <CarouselContent>
        {events.map((event) => (
          <EventSlide key={event.id} event={event} />
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-2 sm:left-3" />
      <CarouselNext className="right-2 sm:right-3" />
    </Carousel>
  )
}
