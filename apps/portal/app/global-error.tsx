"use client"

import * as React from "react"
import * as Sentry from "@sentry/nextjs"
import { HomeIcon, RefreshCcwIcon, TriangleAlertIcon } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { buttonVariants } from "@workspace/ui/lib/button-variants"
import { cn } from "@workspace/ui/lib/utils"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset?: (() => void) | unknown
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [isRetrying, setIsRetrying] = React.useState(false)
  const retryTimeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    console.error(error)
    Sentry.captureException(error)
  }, [error])

  React.useEffect(() => {
    return () => {
      if (retryTimeoutRef.current !== null) {
        window.clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  const supportId = error.digest ?? "Unavailable"

  const handleRetry = React.useCallback(() => {
    if (isRetrying) {
      return
    }

    setIsRetrying(true)

    if (typeof reset !== "function") {
      window.location.reload()
      return
    }

    reset()

    retryTimeoutRef.current = window.setTimeout(() => {
      window.location.reload()
    }, 1200)
  }, [isRetrying, reset])

  const handleGoHome = React.useCallback(() => {
    window.location.assign("/")
  }, [])

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <main className="relative min-h-screen overflow-hidden bg-background">
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-20"
          >
            <div className="absolute top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute right-10 bottom-10 h-64 w-64 rounded-full bg-chart-2/20 blur-3xl" />
          </div>

          <section className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-14 sm:px-6 lg:px-8">
            <Card className="w-full border-border/60 bg-card/90 shadow-xl backdrop-blur-sm">
              <CardContent className="p-8 sm:p-10">
                <div className="mx-auto max-w-2xl text-center">
                  <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
                    <TriangleAlertIcon className="size-6" />
                  </div>

                  <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Application Error
                  </p>

                  <h1 className="mt-2 bg-gradient-to-r from-primary via-primary/80 to-chart-2 bg-clip-text pb-1 text-4xl leading-[1.12] font-extrabold tracking-tight text-transparent sm:text-5xl">
                    Something went wrong
                  </h1>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    We hit an unexpected issue while loading this page. You can
                    try again now, or return to the home page.
                  </p>

                  <div className="mx-auto mt-3 w-fit max-w-xs rounded-md border border-border/60 bg-muted/35 px-2.5 py-1.5 text-center text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Support ID:
                    </span>{" "}
                    {supportId}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className={cn(
                        buttonVariants({ variant: "default", size: "lg" })
                      )}
                    >
                      <RefreshCcwIcon
                        className={cn("size-4", isRetrying && "animate-spin")}
                      />
                      {isRetrying ? "Retrying..." : "Try Again"}
                    </button>

                    <button
                      type="button"
                      onClick={handleGoHome}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" })
                      )}
                    >
                      <HomeIcon className="size-4" />
                      Back to Home
                    </button>
                  </div>

                  <p className="mt-6 text-xs text-muted-foreground">
                    If this keeps happening, include the Support ID when
                    reporting the issue.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </body>
    </html>
  )
}
