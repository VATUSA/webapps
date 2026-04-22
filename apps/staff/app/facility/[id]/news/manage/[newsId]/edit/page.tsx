import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "News Edit Redirect",
  description: "Redirects to the canonical news edit route.",
})

export default async function NewsManageEditAliasPage({
  params,
}: {
  params: Promise<{ id: string; newsId: string }>
}) {
  const { id, newsId } = await params
  redirect(`/facility/${id}/news/${newsId}/edit`)
}
