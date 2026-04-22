import { notFound } from "next/navigation"
import type { Metadata } from "next"
import NewsIndex from "@/components/News/NewsIndex"
import { fetchNewsPage } from "@/actions/news"
import { getSession } from "@/lib/session"
import {
  ACTION,
  OBJECT,
  hasScopedPermission,
  normalizePermissionCollections,
} from "@/lib/acl"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Manage News Posts",
  description: "Review, paginate, edit, and delete staff news posts.",
})

function parsePositiveInt(value: string | undefined) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export default async function FacilityNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const query = await searchParams
  const page = parsePositiveInt(query.page)
  const facilityId = id.trim().toUpperCase()
  const session = await getSession()
  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections(session.cobalt)
  const canCreatePost = hasScopedPermission({
    globalPermissions,
    facilityPermissions: allFacilityPermissions,
    object: OBJECT.newsPost,
    action: ACTION.write,
    facilityId,
  })

  const result = await fetchNewsPage(page)
  if (result.items.length === 0 && page > 1) {
    notFound()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <NewsIndex
        items={result.items}
        page={result.page}
        facilityId={facilityId.toLowerCase()}
        canCreatePost={canCreatePost}
      />
    </main>
  )
}
