"use client"

import * as React from "react"
import { toast } from "sonner"

type FormErrorToastProps = {
  error: string | null | undefined
  title?: string
  description?: string
}

export function FormErrorToast({
  error,
  title = "Something went wrong",
  description,
}: FormErrorToastProps) {
  const lastErrorRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!error) {
      lastErrorRef.current = null
      return
    }

    if (error === lastErrorRef.current) return

    lastErrorRef.current = error
    toast.error(title, {
      description: description ?? error,
    })
  }, [error, title, description])

  return null
}
