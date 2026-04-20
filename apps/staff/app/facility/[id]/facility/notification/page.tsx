import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function FacilityNotificationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Notification Config"
      description="Manage outbound notifications and delivery preferences."
      facilityId={id}
    />
  )
}

