"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function NewsDeleteSuccessToast() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasShownRef = React.useRef(false)

  React.useEffect(() => {
    const deleted = searchParams.get("newsDeleted") === "1"
    if (!deleted || hasShownRef.current) return

    hasShownRef.current = true
    toast.success("News post deleted successfully.")

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete("newsDeleted")

    const nextQuery = nextParams.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }, [pathname, router, searchParams])

  return null
}

