import { notFound } from "next/navigation"
import NewsPostList from "@/components/News/NewsPostList"
import NewsPagination from "@/components/News/NewsPagination"
import { fetchNewsPage } from "@/actions/news"

type NewsIndexPageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function NewsIndexPage({
  searchParams,
}: NewsIndexPageProps) {
  const { page: pageParam } = await searchParams
  const page = pageParam ? Number(pageParam) : 1

  if (!Number.isInteger(page) || page < 1) {
    notFound()
  }

  const result = await fetchNewsPage(page)

  // If user manually requests page N where no content exists, show not found for N>1
  if (result.items.length === 0 && page > 1) {
    notFound()
  }

  return (
    <main className="container mx-auto max-w-4xl py-6">
      <section className="mb-6 rounded-xl border border-border/60 bg-card/95 p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          VATUSA News
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Latest Announcements
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Official division updates, staffing announcements, and community news.
        </p>
      </section>

      <NewsPostList items={result.items} />

      <NewsPagination
        page={result.page}
        hasPrev={result.hasPrev}
        hasNext={result.hasNext}
      />
    </main>
  )
}
