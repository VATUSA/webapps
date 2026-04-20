import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function FacilityTechPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Tech Config"
      description="Manage facility technical settings and integrations."
      facilityId={id}
    />
  )
}

