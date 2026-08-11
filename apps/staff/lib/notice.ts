/**
 * Cross-navigation "notice" flags. A server action redirects with a notice,
 * and the client `NoticeToast` (mounted in the facility layout) shows it once
 * and strips the params. Used to surface success/error results of redirect-based
 * server actions (delete, review, …) as toasts.
 */

export type NoticeKind = "success" | "error" | "warning" | "info"

export const NOTICE_PARAM = "notice"
export const NOTICE_KIND_PARAM = "noticeKind"

/** Append a notice (message + kind) to a path, preserving existing query params. */
export function withNotice(
  path: string,
  kind: NoticeKind,
  message: string
): string {
  const [pathname = "", query = ""] = path.split("?")
  const params = new URLSearchParams(query)
  params.set(NOTICE_PARAM, message)
  params.set(NOTICE_KIND_PARAM, kind)
  const nextQuery = params.toString()
  return nextQuery ? `${pathname}?${nextQuery}` : pathname
}
