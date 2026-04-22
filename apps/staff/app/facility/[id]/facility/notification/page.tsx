import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Notification Config",
  description: "Manage outbound notifications and delivery preferences.",
})

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

