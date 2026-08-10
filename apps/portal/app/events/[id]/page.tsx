import { notFound } from "next/navigation"
import EventDetail from "@workspace/ui/components/event-detail"
import { fetchEventById } from "@/actions/events"
import { Metadata } from "next"

// Keep in sync with PUBLIC_REVALIDATE_SECONDS in @/lib/cache — Next.js requires
// this to be a statically analyzable literal.
export const revalidate = 300

// Returning an empty array prerenders nothing at build time but marks the route
// static-capable, so each event is rendered once on first visit and then served
// from cache. Without this Next.js renders every request from scratch, which is
// what let scraper traffic saturate the event loop.
export async function generateStaticParams() {
  return []
}

type EventPageProps = {
  params: Promise<{
    id: string
  }>
}


export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const event = await fetchEventById(id)
    return {
      title: `${event?.title} | VATUSA Events`,
      description: event?.body?.substring(0, 160) || "VATUSA Event",
    }
  } catch {
    return {
      title: "Event Not Found | VATUSA",
      description: "This event could not be found",
    }
  }
}

export default async function Page({ params }: EventPageProps) {
  const { id: idParam } = await params
  const id = Number(idParam)

  if (!Number.isInteger(id) || id <= 0) {
    notFound()
  }

  const event = await fetchEventById(id)
  if (!event) {
    notFound()
  }

  return (
    <main className="container mx-auto py-6">
      <EventDetail event={event} />
    </main>
  )
}
