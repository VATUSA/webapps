import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Training Notes",
  description: "Notes and records for trainee progress and mentoring.",
})

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

