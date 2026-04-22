import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Visit Requests",
  description: "Pending visit requests for this facility.",
})

export default async function VisitRequestsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Visit Requests"
      description="Pending visit requests for this facility."
      facilityId={id}
    />
  )
}

