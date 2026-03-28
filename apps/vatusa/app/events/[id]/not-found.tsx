import { Card, CardContent } from "@workspace/ui/components/card"
import { EventNotFoundActions } from "@/components/Events/EventNotFoundActions"

export default function NotFound() {
  return (
    <main className="relative min-h-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20"
      >
        <div className="absolute top-12 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-8 bottom-8 h-56 w-56 rounded-full bg-chart-2/20 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <Card className="relative z-10 w-full border-border/60 bg-card/90 text-center shadow-lg backdrop-blur-sm">
          <CardContent className="p-8 sm:p-12">
            <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Event 404
            </p>

            <h1 className="bg-linear-to-r from-primary via-primary/80 to-chart-2 bg-clip-text pb-1 text-5xl leading-[1.12] font-extrabold tracking-tight text-transparent sm:text-6xl">
              Event not found
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This event may have been removed, renamed, or the link may be
              invalid. Browse all upcoming events or return to the home page.
            </p>

            <EventNotFoundActions />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
