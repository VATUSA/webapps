import { getAceTeam } from "@workspace/third-party/cobalt"
import type { Metadata } from "next"
import AceTeamIndex from "@/components/Ace/AceTeamIndex"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
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

  // ACE Team membership is a division staff role, so managing it requires
  // write on that role object -- the same check cobalt runs server-side.
  const permissionCheck = await checkLivePermission({
    object: OBJECT.divisionStaffRole,
    action: ACTION.write,
    facilityId,
    message: `You do not have live Cobalt permission to manage the ACE Team for ${facilityId}.`,
  })

  if (!permissionCheck.allowed) {
    return (
      <UnauthorizedPanel
        message={permissionCheck.message}
        backHref={buildStaffHomeHref(facilityId)}
        toastMessage={permissionCheck.message}
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
