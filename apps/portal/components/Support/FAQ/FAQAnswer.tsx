"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"

// Answers are authored as Markdown (converted from the legacy knowledgebase
// HTML). The only raw HTML we intentionally allow through is <u>/<br>, since
// Markdown has no underline. rehype-raw parses the inline HTML and
// rehype-sanitize then strips anything outside this allowlist.
const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u", "br"],
}

type FAQAnswerProps = {
  content: string
}

export default function FAQAnswer({ content }: FAQAnswerProps) {
  return (
    <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
        components={{
          p: ({ node: _node, ...props }) => (
            <p className="first:mt-0 last:mb-0" {...props} />
          ),
          ul: ({ node: _node, ...props }) => (
            <ul className="list-disc space-y-1 pl-5" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="list-decimal space-y-1 pl-5" {...props} />
          ),
          a: ({ node: _node, href, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-primary underline-offset-4 hover:underline"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
