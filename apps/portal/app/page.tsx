import { EventCarousel } from "@/components/Events/EventCarousel/EventCarousel"
import DisclaimerBanner from "@/components/HomePage/DisclaimerBanner"
import HomeFeedList, {
  type HomeFeedItem,
} from "@/components/HomePage/HomeFeedList"
import NewsFeedList from "@/components/HomePage/NewsFeedList"
import {
  getNewsPage,
  getUpcomingEvents,
  type CobaltEvent,
  type CobaltNewsItem,
} from "@workspace/third-party/cobalt"
import { Metadata } from "next"
import { PUBLIC_CACHE } from "@/lib/cache"
import { HOME_FEED_LIMIT } from "@/lib/homeFeed"

export const metadata: Metadata = {
  title: "Home | VATUSA",
  description: "Welcome to VATUSA - The United States Division of VATSIM",
}

// Must be a literal: Next.js requires `revalidate` to be statically analyzable,
// so it cannot reference PUBLIC_REVALIDATE_SECONDS. Keep the two in sync.
export const revalidate = 300

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

export default async function Page() {
  let cobaltUpcomingEvents: CobaltEvent[] = []
  let cobaltNews: CobaltNewsItem[] = []

  const [eventsResult, newsResult] = await Promise.allSettled([
    getUpcomingEvents(HOME_FEED_LIMIT, PUBLIC_CACHE),
    getNewsPage(1, PUBLIC_CACHE),
  ])

  if (eventsResult.status === "fulfilled") {
    cobaltUpcomingEvents = eventsResult.value
  } else {
    console.error("Failed to load home upcoming events:", eventsResult.reason)
  }

  if (newsResult.status === "fulfilled") {
    cobaltNews = newsResult.value
  } else {
    console.error("Failed to load home news:", newsResult.reason)
  }

  const upcomingEvents: HomeFeedItem[] = cobaltUpcomingEvents.map((event) => ({
    id: `event-${event.id}`,
    title: event.title,
    href: `/events/${event.id}`,
    date: `${formatZulu(event.start_timestamp)} - ${formatZulu(event.end_timestamp)}`,
  }))

  return (
    <div className="container mx-auto">
      <div className="flex w-full justify-center py-4">
        <EventCarousel events={cobaltUpcomingEvents} />
      </div>

      <DisclaimerBanner />

      <section className="mt-8 grid gap-4 pb-6 md:grid-cols-2">
        <NewsFeedList
          title="Recent News"
          titleHref="/news"
          items={cobaltNews}
          emptyText="No recent news."
        />

        <HomeFeedList
          title="Upcoming Events"
          titleHref="/events"
          items={upcomingEvents}
          emptyText="No upcoming events."
        />
      </section>
    </div>
  )
}
