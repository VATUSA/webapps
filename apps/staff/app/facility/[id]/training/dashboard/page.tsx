import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Training Dashboard",
  description: "Landing page for facility training workflows and status.",
})

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

