import { notFound } from "next/navigation"
import NewsIndex from "@/components/News/NewsIndex"
import { fetchNewsPage } from "@/actions/news"

function parsePositiveInt(value: string | undefined) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export default async function FacilityNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const query = await searchParams
  const page = parsePositiveInt(query.page)

  const result = await fetchNewsPage(page)
  if (result.items.length === 0 && page > 1) {
    notFound()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <NewsIndex items={result.items} page={result.page} facilityId={id.toLowerCase()} />
    </main>
  )
}

