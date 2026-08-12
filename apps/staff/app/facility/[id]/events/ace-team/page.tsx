import { getAceTeam } from "@workspace/third-party/cobalt"
import type { Metadata } from "next"
import AceTeamIndex from "@/components/Ace/AceTeamIndex"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { canManageAceTeam, fetchAssignableRoles } from "@/lib/assignableRoles"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"

export const metadata: Metadata = createStaffPageMetadata({
  title: "ACE Team Management",
  description: "Add and remove members from the ACE Team.",
})

export default async function AceManagementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const facilityId = id.trim().toUpperCase()

  const assignableRoles = await fetchAssignableRoles()

  if (!canManageAceTeam(assignableRoles)) {
    const message = "You do not have permission to manage the ACE Team."

    return (
      <UnauthorizedPanel
        message={message}
        backHref={buildStaffHomeHref(facilityId)}
        toastMessage={message}
      />
    )
  }

  const members = await getAceTeam()

  return (
    <div className="space-y-4">
      <AceTeamIndex members={members} canManageAceTeam />
    </div>
  )
}
