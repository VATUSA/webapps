"use client"

import Link from "next/link"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export function NewsNotFoundActions() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/news"
        className={cn(buttonVariants({ variant: "default", size: "lg" }))}
      >
        Back to News
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
