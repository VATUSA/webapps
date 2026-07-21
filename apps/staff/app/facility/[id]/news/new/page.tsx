import NewsForm from "@/components/News/NewsForm"
import type { Metadata } from "next"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Create News Post",
  description: "Publish a new post to the shared Cobalt news feed.",
})

export default async function NewNewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const facilityId = id.trim().toUpperCase()

  const permissionCheck = await checkLivePermission({
    object: OBJECT.newsPost,
    action: ACTION.write,
    facilityId,
    message: `You do not have live Cobalt permission to publish news posts for ${facilityId}.`,
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

  return (
    <div className="flex flex-1 flex-col gap-4">
      <NewsForm mode="create" facilityId={facilityId.toLowerCase()} />
    </div>
  )
}
