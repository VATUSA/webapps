import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import NewsForm from "@/components/News/NewsForm"
import { fetchNewsPostForEdit } from "@/actions/news"

type SrNewsEditPageProps = {
  params: Promise<{
    id: string
    newsId: string
  }>
}

function normalizeFacilityId(raw: string) {
  return raw.trim().toUpperCase()
}

export default async function Page({ params }: SrNewsEditPageProps) {
  const { id, newsId } = await params
  const facilityId = normalizeFacilityId(id)

  const news = await fetchNewsPostForEdit(newsId)
  if (!news) notFound()

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
            <BreadcrumbLink
              render={<Link href={`/facility/${facilityId}/sr/news`} />}
            >
              News
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit News Post
        </h1>
        <p className="text-sm text-muted-foreground">
          Update this all-teams news post.
        </p>
      </header>

      <NewsForm
        mode="edit"
        facilityId={facilityId}
        news={news}
      />
    </main>
  )
}
