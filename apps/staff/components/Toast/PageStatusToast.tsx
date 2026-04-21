"use client"

import * as React from "react"
import { toast } from "sonner"

type PageStatusToastProps = {
  message?: string | null
  title?: string
  variant?: "warning" | "error" | "success" | "info"
}

export function PageStatusToast({
  message,
  title = "Status Update",
  variant = "info",
}: PageStatusToastProps) {
  const lastMessageRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!message) {
      lastMessageRef.current = null
      return
    }

    if (message === lastMessageRef.current) return

    lastMessageRef.current = message

    const toastFn =
      variant === "warning"
        ? toast.warning
        : variant === "error"
          ? toast.error
          : variant === "success"
            ? toast.success
            : toast

    toastFn(title, {
      description: message,
    })
  }, [message, title, variant])

  return null
}
