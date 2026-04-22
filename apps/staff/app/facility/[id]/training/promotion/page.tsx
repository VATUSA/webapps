import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Controller Promotion",
  description: "Promotion workflows for controller progression.",
})

export default async function TrainingPromotionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Controller Promotion"
      description="Promotion workflows for controller progression."
      facilityId={id}
    />
  )
}

