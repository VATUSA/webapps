import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function FacilityInfoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Facility Info"
      description="Manage facility profile fields, links, and descriptive metadata."
      facilityId={id}
    />
  )
}

