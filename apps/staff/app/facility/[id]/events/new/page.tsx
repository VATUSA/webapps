import EventForm from "@/components/Events/EventForm"

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <EventForm mode="create" facilityId={id.toLowerCase()} />
    </main>
  )
}

