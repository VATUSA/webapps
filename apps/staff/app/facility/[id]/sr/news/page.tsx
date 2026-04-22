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
import { getNewsPage } from "@workspace/third-party/cobalt"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import NewsIndex from "@/components/News/NewsIndex"
import NewsDeleteSuccessToast from "@/components/News/NewsDeleteSuccessToast"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"

export const metadata: Metadata = createStaffPageMetadata({
  title: "SR News",
  description: "Browse and manage SR news posts with pagination.",
})

type DivisionNewsPageProps = {
  params: Promise<{
    id: string
  }>
  searchParams?: Promise<{
    page?: string | string[]
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number.parseInt(raw ?? "1", 10)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export default async function Page({ params, searchParams }: DivisionNewsPageProps) {
  const { id } = await params
  const facilityId = normalizeFacilityId(id)
  const facilitySlug = facilityId.toLowerCase()
  const query = await searchParams
  const page = parsePage(query?.page)

  const permissionCheck = await checkLivePermission({
    object: OBJECT.newsPost,
    action: ACTION.write,
    facilityId,
    message: `You do not have live Cobalt permission to publish news posts for ${facilityId}.`,
  })

  if (!permissionCheck.allowed) {
    return (
      <UnauthorizedPanel
        message={permissionCheck.message}
        backHref={buildStaffHomeHref(facilityId)}
        toastMessage={permissionCheck.message}
      />
    )
  }

  const news = await getNewsPage(page)

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
              render={<Link href={`/facility/${facilityId}/staff`} />}
            >
              SR Staff
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>News</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">News</h1>
          <p className="text-sm text-muted-foreground">
            All news posts are listed here, with pagination to move through older pages.
          </p>
        </header>

        <Link
          href={`/facility/${facilitySlug}/sr/news/new`}
          className="inline-flex h-9 items-center justify-center rounded-md border border-transparent bg-primary px-4 text-sm font-medium whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Create Post
        </Link>
      </div>

      <NewsIndex
        items={news}
        page={page}
        facilityId={facilitySlug}
        canCreatePost
        canManagePost
      />

      <NewsDeleteSuccessToast />
    </main>
  )
}
