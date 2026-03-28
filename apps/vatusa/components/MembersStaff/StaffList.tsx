import { MailIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export type StaffEntry = {
  id: string
  position: string
  name: string
  email: string
}

type StaffListProps = {
  entries: StaffEntry[]
}

export default function StaffList({ entries }: StaffListProps) {
  return (
    <Card className="border-border/60 bg-card/95">
      <CardHeader>
        <CardTitle>VATUSA Staff</CardTitle>
      </CardHeader>

      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No staff found.</p>
        ) : (
          <ul className="divide-y divide-border/60 overflow-hidden rounded-md border border-border/60">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-accent/50 focus-within:bg-accent/50"
              >
                <span className="text-sm font-medium text-foreground">
                  {entry.position}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                    {entry.name}
                  </span>

                  <a
                    href={`mailto:${entry.email}`}
                    aria-label={`Email ${entry.name} (${entry.position})`}
                    className="inline-flex size-8 items-center justify-center rounded-md border border-border/60 bg-transparent text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground group-hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <MailIcon className="size-4" />
                    <span className="sr-only">Email {entry.name}</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
