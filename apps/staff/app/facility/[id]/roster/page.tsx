import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function RosterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Roster"
      description="Full facility roster view (home and visiting controllers)."
      facilityId={id}
    />
  )
}

