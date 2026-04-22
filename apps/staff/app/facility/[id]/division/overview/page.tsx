import Link from "next/link"
import type { Metadata } from "next"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Card, CardContent } from "@workspace/ui/components/card"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Division Overview",
  description: "Division-level summary area and quick actions.",
})

type DivisionOverviewPageProps = {
  params: Promise<{
    id: string
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

export default async function Page({ params }: DivisionOverviewPageProps) {
  const { id } = await params
  const facilityId = normalizeFacilityId(id)
  
  return (
    <main className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href={`/facility/${facilityId.toLowerCase()}/overview`} />}
            >
              Overview
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Division Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="rounded-2xl border border-border/60 bg-muted/20 p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Coming Soon
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Division Overview
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            This page is just a placeholder for now. It will eventually show
            division-level summary information, quick actions, and useful
            workflow links for {facilityId}.
          </p>
        </div>
      </section>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="space-y-2 p-6">
          <h2 className="text-base font-semibold">Placeholder Section</h2>
          <p className="text-sm text-muted-foreground">
            Nothing is wired up here yet. This space is reserved for future
            division content.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
