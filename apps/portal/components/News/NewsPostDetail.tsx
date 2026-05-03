import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { MarkdownContent } from "@workspace/ui/components/markdown-content"
import { type CobaltNewsItem } from "@workspace/third-party/cobalt"

type NewsPostDetailProps = {
  post: CobaltNewsItem
}

function formatPostDate(post: CobaltNewsItem): string {
  if (post.post_date) {
    return post.post_date
  }

  if (typeof post.post_timestamp === "number") {
    const d = new Date(post.post_timestamp * 1000)
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

export default function NewsPostDetail({ post }: NewsPostDetailProps) {
  return (
    <Card className="border-border/60 bg-card/95">
      <CardContent className="pt-6">
        <CardHeader className="space-y-2 px-0">
          <CardTitle className="text-2xl tracking-tight sm:text-3xl">
            {post.title}
          </CardTitle>

          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground/90">CID:</span>{" "}
            {post.author_cid ?? "Unknown"}
            <span className="mx-2 text-border">•</span>
            <span className="font-medium text-foreground/90">Date:</span>{" "}
            {formatPostDate(post)}
          </p>
        </CardHeader>

        <MarkdownContent
          content={post.body}
          emptyFallback="_No content provided._"
          className="mt-4"
        />
      </CardContent>
    </Card>
  )
}
