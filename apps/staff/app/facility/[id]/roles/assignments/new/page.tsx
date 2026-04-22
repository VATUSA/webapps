import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Assign Role",
  description: "Assign a role by CID and selected role scope.",
})

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

