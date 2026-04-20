import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function HomeRosterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Home Roster"
      description="Roster filtered to home controllers only."
      facilityId={id}
    />
  )
}

