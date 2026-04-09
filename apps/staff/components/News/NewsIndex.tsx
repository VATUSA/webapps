import Link from "next/link"
import { Card, CardContent } from "@workspace/ui/components/card"
import type { CobaltNewsItem } from "@workspace/third-party/cobalt"
import DeleteNewsPostButton from "@/components/News/DeleteNewsPostButton"
import { deleteNewsPostAction } from "@/actions/news"

const PAGE_SIZE = 20

function excerpt(value?: string) {
  const text = value?.trim().replace(/\s+/g, " ")
  if (!text) return "No description provided."

  return text.length > 180 ? `${text.slice(0, 177)}...` : text
}

export default function NewsIndex({
  items,
  page,
  facilitySlug,
  editBaseHref,
}: {
  items: CobaltNewsItem[]
  page: number
  facilitySlug: string
  editBaseHref: string
}) {
  const hasPrevious = page > 1
  const hasNext = items.length === PAGE_SIZE
  const previousHref = `?page=${Math.max(1, page - 1)}`
  const nextHref = `?page=${page + 1}`

  return (
    <div className="space-y-4">
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
                    <th className="px-4 py-3">Body</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60">
                  {items.map((item) => (
                    <tr key={item.id} className="align-top">
                      <td className="px-4 py-4">
                        <div className="font-medium text-foreground">
                          {item.title}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="line-clamp-2 max-w-xl text-sm text-muted-foreground">
                          {excerpt(item.body)}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`${editBaseHref}/${item.id}/edit`}
                            className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium whitespace-nowrap text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                          >
                            Edit
                          </Link>

                          <form action={deleteNewsPostAction}>
                            <input
                              type="hidden"
                              name="newsId"
                              value={String(item.id)}
                            />
                            <input
                              type="hidden"
                              name="facilitySlug"
                              value={facilitySlug}
                            />
                            <input
                              type="hidden"
                              name="returnTo"
                              value={`/facility/${facilitySlug}/sr/news?page=${page}`}
                            />
                            <DeleteNewsPostButton itemTitle={item.title} />
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
