import { redirect } from "next/navigation"

export default async function FacilityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/facility/${id}/roster`)
}

