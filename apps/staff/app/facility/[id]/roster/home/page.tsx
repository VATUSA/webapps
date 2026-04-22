import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Home Roster",
  description: "Roster filtered to home controllers only.",
})

export default async function HomeRosterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Home Roster"
      description="Roster filtered to home controllers only."
      facilityId={id}
    />
  )
}

