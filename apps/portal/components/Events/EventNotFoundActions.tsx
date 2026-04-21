"use client"

import Link from "next/link"
import { buttonVariants } from "@workspace/ui/lib/button-variants"
import { cn } from "@workspace/ui/lib/utils"

export function EventNotFoundActions() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/events"
        className={cn(buttonVariants({ variant: "default", size: "lg" }))}
      >
        Back to Events
      </Link>

      <Link
        href="/"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      >
        Back to Home
      </Link>
    </div>
  )
}
