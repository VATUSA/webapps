import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import { cn } from "@workspace/ui/lib/utils"

// Content is authored as Markdown but may contain a small allowlist of raw
// HTML (e.g. <br>, <u>) that Markdown has no syntax for. rehype-raw parses
// that inline HTML and rehype-sanitize then strips anything outside this
// allowlist. This is the single place in the app that needs to reason about
// which raw tags are safe to let through — every markdown surface (news,
// events, FAQ) renders through this component.
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u", "br"],
}

type MarkdownVariant = "article" | "compact"

type MarkdownContentProps = {
  content?: string
  emptyFallback?: string
  className?: string
  /**
   * "article" (default) is the larger, serif-headed styling used for news
   * posts and events. "compact" is the smaller, muted styling used for
   * things like FAQ answers, and opens links in a new tab.
   */
  variant?: MarkdownVariant
}

function toCodeText(children: React.ReactNode) {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string") return child
      return ""
    })
    .join("")
    .replace(/\n$/, "")
}

function inferCodeLanguage(codeText: string) {
  const firstLine = codeText.split("\n")[0]?.trim() ?? ""

  if (
    firstLine.startsWith("$ ") ||
    firstLine.startsWith("npm ") ||
    firstLine.startsWith("pnpm ") ||
    firstLine.startsWith("yarn ") ||
    firstLine.startsWith("cargo ") ||
    firstLine.startsWith("docker ") ||
    firstLine.startsWith("git ") ||
    firstLine.startsWith("curl ") ||
    firstLine.startsWith("cp ") ||
    firstLine.startsWith("mv ") ||
    firstLine.startsWith("rm ")
  ) {
    return "bash"
  }

  return null
}

export function MarkdownContent({
  content,
  emptyFallback = "_No content provided._",
  className,
  variant = "article",
}: MarkdownContentProps) {
  const isCompact = variant === "compact"

  return (
    <div
      className={cn(
        isCompact
          ? "space-y-2 text-sm leading-relaxed text-muted-foreground"
          : "max-w-none text-[1.02rem] leading-8 text-foreground",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={{
          h1: ({ node: _node, ...props }) => (
            <h1
              className="mt-8 mb-5 font-serif text-5xl font-normal tracking-tight first:mt-0"
              {...props}
            />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2
              className="mt-8 mb-4 font-serif text-4xl font-normal tracking-tight first:mt-0"
              {...props}
            />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3
              className="mt-7 mb-4 font-serif text-3xl font-normal tracking-tight first:mt-0"
              {...props}
            />
          ),
          h4: ({ node: _node, ...props }) => (
            <h4
              className="mt-6 mb-3 text-2xl font-semibold tracking-tight first:mt-0"
              {...props}
            />
          ),
          h5: ({ node: _node, ...props }) => (
            <h5
              className="mt-5 mb-3 text-xl font-semibold tracking-tight first:mt-0"
              {...props}
            />
          ),
          h6: ({ node: _node, ...props }) => (
            <h6
              className="mt-5 mb-2 text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase first:mt-0"
              {...props}
            />
          ),
          p: ({ node: _node, ...props }) => (
            <p
              className={
                isCompact
                  ? "first:mt-0 last:mb-0"
                  : "my-4 leading-8 first:mt-0 last:mb-0"
              }
              {...props}
            />
          ),
          ul: ({ node: _node, ...props }) => (
            <ul
              className={
                isCompact
                  ? "list-disc space-y-1 pl-5"
                  : "my-4 list-disc space-y-2 pl-8 marker:text-muted-foreground"
              }
              {...props}
            />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol
              className={
                isCompact
                  ? "list-decimal space-y-1 pl-5"
                  : "my-4 list-decimal space-y-2 pl-8 marker:text-muted-foreground"
              }
              {...props}
            />
          ),
          li: ({ node: _node, ...props }) => (
            <li className={isCompact ? undefined : "pl-1 leading-8"} {...props} />
          ),
          blockquote: ({ node: _node, ...props }) => (
            <blockquote
              className="my-6 border-l-2 border-border/80 pl-5 font-serif text-[1.08rem] leading-8 text-muted-foreground italic"
              {...props}
            />
          ),
          a: ({ node: _node, ...props }) =>
            isCompact ? (
              <a
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary underline-offset-4 hover:underline"
                {...props}
              />
            ) : (
              <a
                className="text-primary underline decoration-primary/50 underline-offset-4 transition-colors hover:decoration-primary"
                {...props}
              />
            ),
          hr: ({ node: _node, ...props }) => (
            <hr className="my-8 border-border/80" {...props} />
          ),
          pre: ({ node: _node, children }) => {
            const child = React.Children.only(children) as React.ReactElement<{
              className?: string
              children?: React.ReactNode
            }>
            const className = child.props.className
            const codeText = toCodeText(child.props.children)
            const language =
              className?.match(/language-([\w-]+)/)?.[1] ??
              inferCodeLanguage(codeText) ??
              "text"
            const lines = codeText.split("\n")

            return (
              <div className="my-4 overflow-hidden rounded-[4px] bg-[color-mix(in_oklab,var(--card)_82%,black_18%)]">
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <div className="rounded-[4px] bg-[color-mix(in_oklab,var(--muted)_88%,black_12%)] px-3 py-1 font-sans text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {language}
                  </div>
                </div>

                <div className="overflow-x-auto px-4 pb-4">
                  <code className="grid min-w-full grid-cols-[auto_1fr] gap-x-3 font-mono text-[0.98rem] leading-8 text-foreground">
                    {lines.map((line, index) => (
                      <React.Fragment key={`${language}-${index + 1}`}>
                        <span className="text-right text-muted-foreground/80 select-none">
                          {index + 1}
                        </span>
                        <span className="whitespace-pre">{line || " "}</span>
                      </React.Fragment>
                    ))}
                  </code>
                </div>
              </div>
            )
          },
          code: ({ node: _node, ...props }) => (
            <code
              className="inline-block rounded-[4px] bg-[color-mix(in_oklab,var(--muted)_78%,transparent)] px-[2px] py-0 font-mono text-[0.875em] leading-[1.4286] text-[var(--color-vatusa-red)] dark:text-[color-mix(in_oklab,var(--color-vatusa-red)_72%,white_28%)]"
              {...props}
            />
          ),
          table: ({ node: _node, ...props }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-border/70">
              <table
                className="w-full border-collapse text-left text-sm"
                {...props}
              />
            </div>
          ),
          thead: ({ node: _node, ...props }) => (
            <thead className="bg-muted/35" {...props} />
          ),
          th: ({ node: _node, ...props }) => (
            <th
              className="border-b border-border/70 px-4 py-3 text-left text-sm font-semibold"
              {...props}
            />
          ),
          td: ({ node: _node, ...props }) => (
            <td
              className="border-t border-border/60 px-4 py-3 align-top text-[0.98rem] leading-7"
              {...props}
            />
          ),
        }}
      >
        {content?.trim() || emptyFallback}
      </ReactMarkdown>
    </div>
  )
}
