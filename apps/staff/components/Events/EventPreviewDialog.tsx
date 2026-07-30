"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { CobaltEvent } from "@workspace/third-party/cobalt"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import EventDetail from "@workspace/ui/components/event-detail"

export default function EventPreviewDialog({
  event,
  defaultOpen = false,
  showTrigger = false,
}: {
  event: CobaltEvent
  defaultOpen?: boolean
  showTrigger?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleOpenChange(next: boolean) {
    setOpen(next)

    // When auto-opened from a `?preview=<id>` redirect, drop the param on close
    // so a refresh (or back navigation) doesn't reopen it.
    if (!next && searchParams.get("preview")) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("preview")
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showTrigger ? (
        <DialogTrigger className="inline-flex h-8 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">
          Preview
        </DialogTrigger>
      ) : null}

      <DialogContent className="p-0">
        <DialogTitle className="sr-only">{event.title}</DialogTitle>
        <DialogDescription className="sr-only">
          Event posting preview
        </DialogDescription>
        <EventDetail event={event} />
      </DialogContent>
    </Dialog>
  )
}
