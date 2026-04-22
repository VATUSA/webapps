import type { Metadata } from "next"
import { SectionPlaceholder } from "@/components/Scaffold/SectionPlaceholder"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Discord Bot Config",
  description: "Configure facility Discord bot settings and synchronization options.",
})

export default async function FacilityDiscordPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <SectionPlaceholder
      title="Discord Bot Config"
      description="Configure facility Discord bot settings and synchronization options."
      facilityId={id}
    />
  )
}

