import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Visitor Roster",
  description: "Roster filtered to visiting controllers.",
})

export default async function VisitRosterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Visitor Roster"
      description="Roster filtered to visiting controllers."
      facilityId={id}
    />
  )
}

