import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export type CobaltNewsItem = {
  id: number
  title: string
  body?: string
  author_cid?: number
  post_timestamp?: number
  post_date?: string
}

type NewsFeedListProps = {
  title?: string
  titleHref?: string
  titleLinkLabel?: string
  items: CobaltNewsItem[]
  emptyText?: string
  makeItemHref?: (item: CobaltNewsItem) => string
}

export default function NewsFeedList({
  title = "Recent News",
  titleHref = "/news",
  titleLinkLabel,
  items,
  emptyText = "No recent news.",
  makeItemHref = (item) => `/news/${item.id}`,
}: NewsFeedListProps) {
  return (
    <Card className="h-full border-border/60 bg-card/95">
      <CardHeader className="pb-3">
        <CardTitle>
          <Link
            href={titleHref}
            aria-label={titleLinkLabel ?? `Go to ${title}`}
            className="inline-flex items-center gap-1 text-lg transition-colors hover:text-primary"
          >
            {title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const href = makeItemHref(item)

              return (
                <li
                  key={item.id}
                  className="group rounded-md border border-border/50 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/50 hover:shadow-sm"
                >
                  <Link
                    href={href}
                    className="block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <p className="font-medium text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </p>

                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground/90">
                          CID:
                        </span>{" "}
                        {item.author_cid ?? "Unknown"}
                        <span className="mx-2 text-border">•</span>
                        <span className="font-medium text-foreground/90">
                          Date:
                        </span>{" "}
                        {item.post_date ?? "Unknown"}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
