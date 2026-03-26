import { EventCarousel } from "@/components/Events/EventCarousel/EventCarousel"
import DisclaimerBanner from "@/components/HomePage/DisclaimerBanner"
import HomeFeedList, {
  type HomeFeedItem,
} from "@/components/HomePage/HomeFeedList"

const recentNews: HomeFeedItem[] = [
  {
    id: "news-1",
    title: "New ARTCC training cycle announced",
    href: "/news",
    date: "Mar 25, 2026",
    summary:
      "Training leadership published the updated spring training timeline.",
  },
  {
    id: "news-2",
    title: "Policy updates posted",
    href: "/news",
    date: "Mar 20, 2026",
  },
]

const upcomingEvents: HomeFeedItem[] = [
  {
    id: "event-1",
    title: "Friday Night Ops: ZLA",
    href: "/events",
    date: "Mar 29, 2026 • 2300z",
    summary:
      "West coast coverage event with staffed enroute and terminal positions.",
  },
  {
    id: "event-2",
    title: "Crossfire: ZBW ↔ ZNY",
    href: "/events",
    date: "Apr 3, 2026 • 0000z",
  },
]

export default function Page() {
  return (
    <div className="container mx-auto">
      <div className="flex w-full justify-center py-4">
        <EventCarousel />
      </div>

      <DisclaimerBanner />

      <section className="mt-8 grid gap-4 pb-6 md:grid-cols-2">
        <HomeFeedList
          title="Recent News"
          titleHref="/news"
          items={recentNews}
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
