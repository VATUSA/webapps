import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function TrainingNotesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Training Notes"
      description="Notes and records for trainee progress and mentoring."
      facilityId={id}
    />
  )
}

