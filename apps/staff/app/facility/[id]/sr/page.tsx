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
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "SR Staff",
  description: "Staffing and workflow area for SR operations.",
})

type SrPageProps = {
  params: Promise<{
	id: string
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

export default async function Page({ params }: SrPageProps) {
  const { id } = await params
  const facilityId = normalizeFacilityId(id)
  const facilitySlug = facilityId.toLowerCase()

  return (
	<main className="space-y-4">
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
			  render={<Link href={`/facility/${facilitySlug}/staff`} />}
			>
			  Staff
			</BreadcrumbLink>
		  </BreadcrumbItem>
		  <BreadcrumbSeparator />
		  <BreadcrumbItem>
			<BreadcrumbPage>SR Staff</BreadcrumbPage>
		  </BreadcrumbItem>
		</BreadcrumbList>
	  </Breadcrumb>

	  <header>
		<h1 className="text-2xl font-semibold tracking-tight">SR Staff</h1>
		<p className="text-sm text-muted-foreground">
		  Placeholder page for SR staff workflows in {facilityId}.
		</p>
	  </header>
	</main>
  )
}
