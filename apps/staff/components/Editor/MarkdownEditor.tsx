"use client"

import * as React from "react"
import type { Crepe } from "@milkdown/crepe"
import { cn } from "@workspace/ui/lib/utils"

type MarkdownEditorProps = {
  name: string
  defaultValue?: string
  required?: boolean
  label?: string
  placeholder?: string
  className?: string
}

export default function MarkdownEditor({
  name,
  defaultValue = "",
  required = false,
  label,
  placeholder = "Write here...",
  className,
}: MarkdownEditorProps) {
  const editorId = React.useId()
  const editorRootRef = React.useRef<HTMLDivElement | null>(null)
  const hiddenFieldRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [value, setValue] = React.useState(defaultValue)
  const [isReady, setIsReady] = React.useState(false)
  const [showRequiredError, setShowRequiredError] = React.useState(false)

  React.useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  React.useEffect(() => {
    const root = editorRootRef.current
    if (!root) return

    let isDisposed = false
    let crepeInstance: Crepe | null = null
    const syncHiddenField = (markdown: string) => {
      setValue(markdown)
      if (hiddenFieldRef.current) {
        hiddenFieldRef.current.value = markdown
      }
    }

    async function mountEditor() {
      const { Crepe } = await import("@milkdown/crepe")

      if (isDisposed || !editorRootRef.current) return

      crepeInstance = new Crepe({
        root: editorRootRef.current,
        defaultValue,
        features: {
          [Crepe.Feature.ImageBlock]: false,
          [Crepe.Feature.Latex]: false,
          [Crepe.Feature.TopBar]: true,
        },
        featureConfigs: {
          [Crepe.Feature.Placeholder]: {
            mode: "doc",
            text: placeholder,
          },
        },
      })

      crepeInstance.on((listener) => {
        listener.markdownUpdated((_ctx, markdown) => {
          if (isDisposed) return
          syncHiddenField(markdown)
          if (markdown.trim().length > 0) {
            setShowRequiredError(false)
          }
        })

        listener.blur(() => {
          if (isDisposed || !required) return
          setShowRequiredError(crepeInstance?.getMarkdown().trim().length === 0)
        })
      })

      await crepeInstance.create()

      if (isDisposed) {
        await crepeInstance.destroy()
        return
      }

      syncHiddenField(crepeInstance.getMarkdown())
      setIsReady(true)
    }

    void mountEditor()

    const form = root.closest("form")

    function handleSubmit() {
      if (!crepeInstance) return
      const markdown = crepeInstance.getMarkdown()
      syncHiddenField(markdown)
      if (!required) return
      setShowRequiredError(markdown.trim().length === 0)
    }

    form?.addEventListener("submit", handleSubmit)

    return () => {
      isDisposed = true
      setIsReady(false)
      form?.removeEventListener("submit", handleSubmit)
      if (crepeInstance) {
        void crepeInstance.destroy()
      }
    }
  }, [defaultValue, placeholder, required])

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <p className="text-sm font-medium">{label}</p> : null}

      <div
        className={cn(
          "rounded-md border bg-background transition-colors",
          showRequiredError
            ? "border-destructive ring-1 ring-destructive/30"
            : "border-input",
          !isReady && "animate-pulse"
        )}
      >
        <div
          id={editorId}
          ref={editorRootRef}
          data-markdown-editor-root
          aria-label={label ?? "Markdown editor"}
          className="min-h-56"
        />
      </div>

      <textarea
        ref={hiddenFieldRef}
        name={name}
        value={value}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />

      {showRequiredError ? (
        <p className="text-sm text-destructive">Content is required.</p>
      ) : null}
    </div>
  )
}
