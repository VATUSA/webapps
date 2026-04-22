import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Roster",
  description: "Full facility roster view (home and visiting controllers).",
})

export default async function RosterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Roster"
      description="Full facility roster view (home and visiting controllers)."
      facilityId={id}
    />
  )
}

