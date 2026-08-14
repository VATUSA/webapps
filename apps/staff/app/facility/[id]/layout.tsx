import type { Metadata } from "next"
import { Suspense, type ReactNode } from "react"
import NoticeToast from "@/components/Toast/NoticeToast"
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
  return (
    <>
      <Suspense fallback={null}>
        <NoticeToast />
      </Suspense>
      {children}
    </>
  )
}
