import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export type PolicyListItem = {
  id: string
  title: string
  summary: string
  href: string
  badge?: string
}

type PoliciesListTabProps = {
  cardTitle: string
  emptyText: string
  items: PolicyListItem[]
}

export default function PoliciesListTab({
  cardTitle,
  emptyText,
  items,
}: PoliciesListTabProps) {
  return (
    <Card className="border-border/60 bg-card/95">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : (
          <ul className="divide-y divide-border/60 overflow-hidden rounded-md border border-border/60">
            {items.map((item) => (
              <li
                key={item.id}
                className="group flex items-start justify-between gap-4 px-4 py-3 transition-colors hover:bg-accent/50"
              >
                <Link href={item.href} className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{item.id} - {item.title}</p>
                  <p className="text-sm text-muted-foreground transition-colors group-hover:text-foreground/80">
                    {item.summary}
                  </p>
                </Link>

                {item.badge ? (
                  <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {item.badge}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
