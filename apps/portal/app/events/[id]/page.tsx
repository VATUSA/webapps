import { notFound } from "next/navigation"
import EventDetail from "@workspace/ui/components/event-detail"
import { fetchEventById } from "@/actions/events"
import { Metadata } from "next"

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
