import { getFacilityApiKeys } from "@workspace/third-party/cobalt"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import FacilityApiKeysTable from "@/components/Facility/FacilityApiKeysTable"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Tech Config",
  description: "Manage facility technical settings and integrations.",
})

export default async function FacilityTechPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const facilityId = id.trim().toUpperCase()

  const permissionCheck = await checkLivePermission({
    object: OBJECT.facilityTechConfig,
    action: ACTION.read,
    facilityId,
    message: `You do not have live Cobalt permission to view tech config for ${facilityId}.`,
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

  const cookieStore = await cookies()
  const cobaltCookie = cookieStore.get("vatusa-cobalt-token")?.value
  const keys = await getFacilityApiKeys(facilityId, cobaltCookie)

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="text-sm text-muted-foreground">
        API v3 keys are provisioned by VATUSA staff and are read-only here for now.
      </div>
      <FacilityApiKeysTable keys={keys} />
    </div>
  )
}
