import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function FacilityDiscordPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Discord Bot Config"
      description="Configure facility Discord bot settings and synchronization options."
      facilityId={id}
    />
  )
}

