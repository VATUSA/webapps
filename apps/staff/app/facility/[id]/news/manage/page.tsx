import { redirect } from "next/navigation"

export default async function NewsManageAliasPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/facility/${id}/news`)
}

