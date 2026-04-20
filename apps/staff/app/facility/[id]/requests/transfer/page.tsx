import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

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

