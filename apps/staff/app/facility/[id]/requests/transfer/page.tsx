import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Transfer Requests",
  description: "Pending transfer requests for this facility.",
})

export default async function TransferRequestsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Transfer Requests"
      description="Pending transfer requests for this facility."
      facilityId={id}
    />
  )
}

