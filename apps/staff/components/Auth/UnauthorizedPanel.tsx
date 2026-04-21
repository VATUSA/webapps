import Link from "next/link"
import { ShieldAlertIcon } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { buttonVariants } from "@workspace/ui/lib/button-variants"
import { cn } from "@workspace/ui/lib/utils"
import { PageStatusToast } from "@/components/Toast/PageStatusToast"

type UnauthorizedPanelProps = {
  title?: string
  message: string
  backHref: string
  backLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  toastMessage?: string
}

export function UnauthorizedPanel({
  title = "Not Authorized",
  message,
  backHref,
  backLabel = "Back to Staff Home",
  secondaryHref = "/",
  secondaryLabel = "Back to Dashboard",
  toastMessage,
}: UnauthorizedPanelProps) {
  return (
    <main className="relative min-h-full overflow-hidden">
      <PageStatusToast
        message={toastMessage}
        title="Not authorized"
        variant="warning"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20"
      >
        <div className="absolute top-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute right-8 bottom-8 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <Card className="w-full border-border/60 bg-card/90 text-center shadow-lg backdrop-blur-sm">
          <CardContent className="p-8 sm:p-12">
            <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600">
              <ShieldAlertIcon className="size-6" />
            </div>

            <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Authorization Required
            </p>

            <h1 className="bg-linear-to-r from-primary via-primary/80 to-amber-500 bg-clip-text pb-1 text-4xl leading-[1.12] font-extrabold tracking-tight text-transparent sm:text-5xl">
              {title}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {message}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={backHref}
                className={cn(buttonVariants({ variant: "default", size: "lg" }))}
              >
                {backLabel}
              </Link>

              <Link
                href={secondaryHref}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {secondaryLabel}
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
