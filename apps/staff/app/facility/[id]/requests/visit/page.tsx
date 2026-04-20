import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

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

