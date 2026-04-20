import { getEventsPage } from "@workspace/third-party/cobalt"
import EventDeleteSuccessToast from "@/components/Events/EventDeleteSuccessToast"
import EventsIndex from "@/components/Events/EventsIndex"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}

function parsePositiveInt(value: string | undefined) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export default async function ManageEventsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  const query = await searchParams
  const page = parsePositiveInt(query.page)

  const allEvents = await getEventsPage(page)
  const facilityId = id.toUpperCase()
  const items =
    facilityId === "USA"
      ? allEvents
      : allEvents.filter((item) => item.facility?.toUpperCase() === facilityId)

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <EventDeleteSuccessToast />
      <EventsIndex items={items} page={page} facilitySlug={id.toLowerCase()} />
    </main>
  )
}

