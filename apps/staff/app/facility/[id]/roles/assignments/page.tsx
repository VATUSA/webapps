import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"

export default async function RoleAssignmentsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Role Assignments"
      description="Manage existing role assignments for this facility."
      facilityId={id}
    />
  )
}

