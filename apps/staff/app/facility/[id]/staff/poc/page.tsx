import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function StaffPocPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Staff POCs"
      description="Configure point-of-contact assignments for staff roles."
      facilityId={id}
    />
  )
}

