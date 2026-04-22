import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Staff POCs",
  description: "Configure point-of-contact assignments for staff roles.",
})

export default async function StaffPocPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Staff POCs"
      description="Configure point-of-contact assignments for staff roles."
      facilityId={id}
    />
  )
}

