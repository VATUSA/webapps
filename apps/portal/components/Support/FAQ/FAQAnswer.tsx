"use client"

import { MarkdownContent } from "@workspace/ui/components/markdown-content"

type FAQAnswerProps = {
  content: string
}

export default function FAQAnswer({ content }: FAQAnswerProps) {
  return (
    <div className="mt-2">
      <MarkdownContent content={content} variant="compact" />
    </div>
  )
}
