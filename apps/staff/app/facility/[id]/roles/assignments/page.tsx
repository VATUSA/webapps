import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Role Assignments",
  description: "Manage existing role assignments for this facility.",
})

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

