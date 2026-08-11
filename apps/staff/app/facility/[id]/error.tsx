"use client"

import { useEffect } from "react"
import { toast } from "sonner"

/**
 * Error boundary for all facility pages. When a page fails to load its data
 * (a thrown fetch/render error), this surfaces a toast and offers a retry
 * instead of crashing to a blank error screen.
 */
export default function FacilityError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Facility page failed to load:", error)
    toast.error("Failed to load", {
      description: "We couldn't load this page. Please try again.",
    })
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          We couldn&apos;t load this page. This is usually temporary — please try
          again.
        </p>
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        Try again
      </button>
    </div>
  )
}
