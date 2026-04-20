import { redirect } from "next/navigation"

export default async function NewsManageEditAliasPage({
  params,
}: {
  params: Promise<{ id: string; newsId: string }>
}) {
  const { id, newsId } = await params
  redirect(`/facility/${id}/news/${newsId}/edit`)
}

