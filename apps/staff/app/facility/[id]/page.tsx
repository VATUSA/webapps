import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Staff Redirect",
  description: "Redirects to the facility staff dashboard.",
})

export default async function FacilityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/facility/${id}/staff`)
}
