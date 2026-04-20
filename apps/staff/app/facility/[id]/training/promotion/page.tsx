import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

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

