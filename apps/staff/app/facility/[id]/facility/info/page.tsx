import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Facility Info",
  description: "Manage facility profile fields, links, and descriptive metadata.",
})

export default async function FacilityInfoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Facility Info"
      description="Manage facility profile fields, links, and descriptive metadata."
      facilityId={id}
    />
  )
}

