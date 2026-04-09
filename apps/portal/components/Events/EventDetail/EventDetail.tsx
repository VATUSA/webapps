import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { type CobaltEvent } from "@workspace/third-party/cobalt"

type EventDetailProps = {
  event: CobaltEvent
}

function formatZulu(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const formatted = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date)

  return `${formatted}Z`
}

export default function EventDetail({ event }: EventDetailProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/95 pt-0">
      {event.banner_image_url ? (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {/* Banner URLs may come from any host; next/image allowlist is too restrictive here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.banner_image_url}
            alt={event.title}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : null}

      <CardContent className="space-y-5 pt-6">
        <CardHeader className="space-y-2 px-0">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="min-w-0 flex-1 text-2xl tracking-tight sm:text-3xl">
              {event.title}
            </CardTitle>
            {event.facility ? (
              <span className="ml-auto inline-flex shrink-0 items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {event.facility}
              </span>
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground">
            {formatZulu(event.start_timestamp)} -{" "}
            {formatZulu(event.end_timestamp)}
          </p>
        </CardHeader>

        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {event.body?.trim() || "_No description provided._"}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}
