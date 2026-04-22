import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Tech Config",
  description: "Manage facility technical settings and integrations.",
})

export default async function FacilityTechPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Tech Config"
      description="Manage facility technical settings and integrations."
      facilityId={id}
    />
  )
}

