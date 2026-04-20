import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function NewRoleAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Assign Role"
      description="Assign a role by CID and selected role scope."
      facilityId={id}
    />
  )
}

