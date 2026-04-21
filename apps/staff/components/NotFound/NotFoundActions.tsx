"use client"

import Link from "next/link"
import { buttonVariants } from "@workspace/ui/lib/button-variants"
import { cn } from "@workspace/ui/lib/utils"

export function NotFoundActions() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "default", size: "lg" }))}
      >
        Back to Home
      </Link>

      <Link
        href="/support/tickets"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      >
        Contact Support
      </Link>
    </div>
  )
}
