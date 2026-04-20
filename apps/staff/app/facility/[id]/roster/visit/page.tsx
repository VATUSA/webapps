import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function VisitRosterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Visitor Roster"
      description="Roster filtered to visiting controllers."
      facilityId={id}
    />
  )
}

