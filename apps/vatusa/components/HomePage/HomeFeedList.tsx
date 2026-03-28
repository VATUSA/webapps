import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export type HomeFeedItem = {
  id: string
  title: string
  href: string
  date?: string
  summary?: string
}

type HomeFeedListProps = {
  title: string
  titleHref?: string
  titleLinkLabel?: string
  items: HomeFeedItem[]
  emptyText?: string
}

export default function HomeFeedList({
  title,
  titleHref,
  titleLinkLabel,
  items,
  emptyText = "No items yet.",
}: HomeFeedListProps) {
  return (
    <Card className="h-full border-border/60 bg-card/95">
      <CardHeader className="pb-3">
        {titleHref ? (
          <CardTitle>
            <Link
              href={titleHref}
              aria-label={titleLinkLabel ?? `Go to ${title}`}
              className="inline-flex items-center gap-1 text-lg transition-colors hover:text-primary"
            >
              {title}
            </Link>
          </CardTitle>
        ) : (
          <CardTitle className="text-lg">{title}</CardTitle>
        )}
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="group rounded-md border border-border/50 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/50 hover:shadow-sm"
              >
                <Link href={item.href} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-sm">
                  <p className="font-medium text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </p>
                  {item.summary ? (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {item.summary}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
