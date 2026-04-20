import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function TrainingDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Training Dashboard"
      description="Landing page for facility training workflows and status."
      facilityId={id}
    />
  )
}

