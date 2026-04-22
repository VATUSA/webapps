import type { Metadata } from "next"
import type { ReactNode } from "react"
import { buildFacilityMetadata } from "@/lib/metadata"

type FacilityMetadataProps = {
  params: Promise<{
    id: string
  }>
}

type FacilityLayoutProps = {
  children: ReactNode
}

export async function generateMetadata({
  params,
}: FacilityMetadataProps): Promise<Metadata> {
  const { id } = await params

  return buildFacilityMetadata(id)
}

export default function FacilityLayout({ children }: FacilityLayoutProps) {
  return children
}
