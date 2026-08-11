"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  NOTICE_KIND_PARAM,
  NOTICE_PARAM,
  type NoticeKind,
} from "@/lib/notice"

const toastByKind: Record<NoticeKind, (message: string) => void> = {
  success: (m) => toast.success(m),
  error: (m) => toast.error(m),
  warning: (m) => toast.warning(m),
  info: (m) => toast.info(m),
}

/**
 * Reads a `?notice=…&noticeKind=…` flag left by a redirect-based server action,
 * shows it as a toast exactly once, then strips the params from the URL. Mounted
 * once in the facility layout so any facility page can surface action results.
 */
export default function NoticeToast() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const shownRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    const message = searchParams.get(NOTICE_PARAM)
    if (!message) {
      shownRef.current = null
      return
    }

    const kind = (searchParams.get(NOTICE_KIND_PARAM) as NoticeKind) || "info"
    const key = `${kind}:${message}`
    if (shownRef.current === key) return
    shownRef.current = key
    ;(toastByKind[kind] ?? toastByKind.info)(message)

    const params = new URLSearchParams(searchParams.toString())
    params.delete(NOTICE_PARAM)
    params.delete(NOTICE_KIND_PARAM)
    const nextQuery = params.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    })
  }, [pathname, router, searchParams])

  return null
}
