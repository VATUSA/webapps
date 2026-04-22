import { notFound } from "next/navigation"
import type { Metadata } from "next"
import NewsForm from "@/components/News/NewsForm"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { fetchNewsPostForEdit } from "@/actions/news"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Edit News Post",
  description: "Update an existing post in the shared Cobalt news feed.",
})

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>
}) {
  const { id, postId } = await params
  const facilityId = id.trim().toUpperCase()
  const newsId = Number(postId)

  if (!Number.isInteger(newsId) || newsId <= 0) {
    notFound()
  }

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

  const news = await fetchNewsPostForEdit(newsId)
  if (!news) {
    notFound()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <NewsForm mode="edit" facilityId={facilityId} news={news} />
    </main>
  )
}
