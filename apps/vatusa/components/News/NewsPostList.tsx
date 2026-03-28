import Link from "next/link"
import { Card, CardContent } from "@workspace/ui/components/card"
import { type CobaltNewsItem } from "@workspace/third_party/cobalt"

type NewsPostListProps = {
  items: CobaltNewsItem[]
}

function formatDate(item: CobaltNewsItem): string {
  if (item.post_date) return item.post_date

  if (typeof item.post_timestamp === "number") {
    const d = new Date(item.post_timestamp * 1000)
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(d)
    }
  }

  return "Unknown"
}

export default function NewsPostList({ items }: NewsPostListProps) {
  if (!items.length) {
    return (
      <Card className="border-border/60 bg-card/95">
        <CardContent className="py-8 text-sm text-muted-foreground">
          No news posts found on this page.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 bg-card/95">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border/70 bg-muted/40 text-left">
                <th className="px-4 py-3 font-semibold text-foreground">
                  Title
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Author CID
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Post Date
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const href = `/news/${item.id}`
                return (
                  <tr
                    key={item.id}
                    className="group border-b border-border/50 transition-colors hover:[&>td]:bg-muted/50 dark:hover:[&>td]:bg-muted/80"
                  >
                    <td className="px-4 py-3 transition-colors">
                      <Link
                        href={href}
                        className="-mx-4 -my-3 block rounded-sm px-4 py-3 font-medium text-foreground underline-offset-4 transition-colors outline-none group-hover:text-primary hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
                        aria-label={`Open news post ${item.title}`}
                      >
                        {item.title}
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground transition-colors">
                      <Link
                        href={href}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="-mx-4 -my-3 block px-4 py-3"
                      >
                        {item.author_cid ?? "Unknown"}
                      </Link>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground transition-colors">
                      <Link
                        href={href}
                        tabIndex={-1}
                        aria-hidden="true"
                        className="-mx-4 -my-3 block px-4 py-3"
                      >
                        {formatDate(item)}
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
