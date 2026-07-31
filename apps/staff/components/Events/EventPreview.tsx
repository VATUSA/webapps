"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { CobaltEvent } from "@workspace/third-party/cobalt"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import EventDetail from "@workspace/ui/components/event-detail"

type EventPreviewContextValue = {
  openPreview: (event: CobaltEvent) => void
}

const EventPreviewContext = createContext<EventPreviewContextValue | null>(null)

/**
 * Wraps a list of events with a single, shared preview dialog. Every "Preview"
 * button drives this one dialog instead of mounting its own, so there's no
 * modal stacking and only one place clears the `?preview` deep-link param.
 *
 * `initialEvent` (fetched server-side from `?preview=<id>`) auto-opens on mount.
 */
export function EventPreviewProvider({
  children,
  initialEvent = null,
}: {
  children: ReactNode
  initialEvent?: CobaltEvent | null
}) {
  const [event, setEvent] = useState<CobaltEvent | null>(initialEvent)
  const [open, setOpen] = useState(initialEvent != null)
  const [autoOpenedId, setAutoOpenedId] = useState<number | null>(
    initialEvent?.id ?? null
  )
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Auto-open when a *new* deep-linked event id arrives, without reopening the
  // same one on unrelated re-renders (initialEvent is a fresh object each time).
  // Uses React's "adjust state during render" pattern rather than an effect.
  if (initialEvent && initialEvent.id !== autoOpenedId) {
    setAutoOpenedId(initialEvent.id)
    setEvent(initialEvent)
    setOpen(true)
  }

  const openPreview = useCallback((next: CobaltEvent) => {
    setEvent(next)
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next)

      // On close, drop the `?preview` deep-link param (if present) so a refresh
      // or back navigation doesn't reopen the dialog.
      if (!next && searchParams.get("preview")) {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("preview")
        const query = params.toString()
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        })
      }
    },
    [pathname, router, searchParams]
  )

  return (
    <EventPreviewContext.Provider value={{ openPreview }}>
      {children}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="p-0">
          {event ? (
            <>
              <DialogTitle className="sr-only">{event.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Event posting preview
              </DialogDescription>
              <EventDetail event={event} />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </EventPreviewContext.Provider>
  )
}

/** A lightweight trigger that opens the shared preview dialog for `event`. */
export function EventPreviewButton({ event }: { event: CobaltEvent }) {
  const ctx = useContext(EventPreviewContext)
  if (!ctx) {
    throw new Error(
      "EventPreviewButton must be used within an EventPreviewProvider"
    )
  }

  return (
    <button
      type="button"
      onClick={() => ctx.openPreview(event)}
      className="inline-flex h-8 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
    >
      Preview
    </button>
  )
}
