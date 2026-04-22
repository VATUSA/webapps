import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "News Redirect",
  description: "Redirects to the news management list.",
})

export default async function NewsManageAliasPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/facility/${id}/news`)
}
