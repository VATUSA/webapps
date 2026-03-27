import { notFound } from "next/navigation"
import EventDetail from "@/components/Events/EventDetail/EventDetail"
import { fetchEventById } from "@/actions/events"

type EventPageProps = {
  params: Promise<{
    id: string
  }>
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
