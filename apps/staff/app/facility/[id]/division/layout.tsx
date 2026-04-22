import type { ReactNode } from "react"
import { redirect } from "next/navigation"

type DivisionLayoutProps = {
  children: ReactNode
  params: Promise<{
    id: string
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

export default async function DivisionLayout({
  children,
  params,
}: DivisionLayoutProps) {
  const { id } = await params
  const facilityId = normalizeFacilityId(id)

  if (facilityId !== "ZHQ") {
    redirect(`/facility/${facilityId.toLowerCase()}/overview`)
  }

  return children
}
