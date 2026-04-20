import Link from "next/link"
import type { CobaltNewsItem } from "@workspace/third-party/cobalt"
import { Card, CardContent } from "@workspace/ui/components/card"
import DeleteNewsButton from "@/components/News/DeleteNewsButton"
import { deleteNewsPostAction } from "@/actions/news"

const PAGE_SIZE = 20

function formatDate(item: CobaltNewsItem) {
  if (item.post_date) return item.post_date

  if (typeof item.post_timestamp === "number") {
    const date = new Date(item.post_timestamp * 1000)
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    }
  }

  if (item.created_timestamp) {
    const date = new Date(item.created_timestamp)
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    }
  }

  return "Unknown"
}

function formatUpdatedDate(item: CobaltNewsItem) {
  if (item.updated_timestamp) {
    const date = new Date(item.updated_timestamp)
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    }
  }

  return "—"
}

export default function NewsIndex({
  items,
  page,
  facilitySlug,
}: {
  items: CobaltNewsItem[]
  page: number
  facilitySlug: string
}) {
  const hasPrevious = page > 1
  const hasNext = items.length === PAGE_SIZE
  const previousHref = `?page=${Math.max(1, page - 1)}`
  const nextHref = `?page=${page + 1}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Link
          href={`/facility/${facilitySlug}/news/new`}
          className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          New Post
        </Link>
      </div>

      {items.length === 0 ? (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No news posts found.
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/60">
                <thead className="bg-muted/40">
                  <tr className="text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3">Posted</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60">
                  {items.map((item) => (
                    <tr key={item.id} className="align-top">
                      <td className="px-4 py-4 font-medium text-foreground">
                        <Link
                          href={`/facility/${facilitySlug}/news/${item.id}/edit`}
                          className="underline-offset-4 transition-colors hover:text-primary hover:underline"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {item.author_cid ?? "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate(item)}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatUpdatedDate(item)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/facility/${facilitySlug}/news/${item.id}/edit`}
                            className="inline-flex h-8 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                          >
                            Edit
                          </Link>
                          <form action={deleteNewsPostAction} className="inline-flex">
                            <input type="hidden" name="newsId" value={String(item.id)} />
                            <input type="hidden" name="facilitySlug" value={facilitySlug} />
                            <input type="hidden" name="page" value={String(page)} />
                            <input
                              type="hidden"
                              name="returnTo"
                              value={`/facility/${facilitySlug}/news?page=${page}`}
                            />
                            <DeleteNewsButton itemTitle={item.title} />
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3">
        {hasPrevious ? (
          <Link
            href={previousHref}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Previous
          </Link>
        ) : (
          <span className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-muted/40 px-3 text-sm text-muted-foreground">
            Previous
          </span>
        )}

        {hasNext ? (
          <Link
            href={nextHref}
            className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Next
          </Link>
        ) : (
          <span className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-muted/40 px-3 text-sm text-muted-foreground">
            Next
          </span>
        )}
      </div>
    </div>
  )
}

