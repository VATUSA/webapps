import Link from "next/link"

type NewsPaginationProps = {
  page: number
  hasPrev: boolean
  hasNext: boolean
}

export default function NewsPagination({
  page,
  hasPrev,
  hasNext,
}: NewsPaginationProps) {
  const prevHref = `/news?page=${page - 1}`
  const nextHref = `/news?page=${page + 1}`

  return (
    <nav
      aria-label="News page navigation"
      className="mt-6 flex items-center justify-between gap-3"
    >
      <div>
        {hasPrev ? (
          <Link
            href={prevHref}
            className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Previous
          </Link>
        ) : (
          <span className="inline-flex h-9 items-center rounded-md border border-border/40 px-3 text-sm text-muted-foreground">
            Previous
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span>
      </p>

      <div>
        {hasNext ? (
          <Link
            href={nextHref}
            className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Next
          </Link>
        ) : (
          <span className="inline-flex h-9 items-center rounded-md border border-border/40 px-3 text-sm text-muted-foreground">
            Next
          </span>
        )}
      </div>
    </nav>
  )
}
