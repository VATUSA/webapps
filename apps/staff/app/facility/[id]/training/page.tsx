import type { Metadata } from "next"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Training",
  description: "Training workflows and staffing support tools.",
})

type TrainingPageProps = {
  params: Promise<{
    id: string
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

export default async function Page({ params }: TrainingPageProps) {
  const { id } = await params
  const facilityId = normalizeFacilityId(id)

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Training</h1>
        <p className="text-sm text-muted-foreground">
          Placeholder page for training workflows in {facilityId}.
        </p>
      </header>
    </div>
  )
}
