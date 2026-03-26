import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto">
      <h1 className="py-5 text-3xl font-semibold text-black dark:text-zinc-50">
        Homepage
      </h1>

      <div className="flex w-full justify-center py-4">
        <div className="relative mx-auto w-full max-w-4xl px-12 sm:px-14">
          <div className="p-1">
            <Card className="overflow-hidden">
              <CardContent className="aspect-video p-0">
                <Skeleton className="h-full w-full rounded-none" />
              </CardContent>
            </Card>
          </div>

          {/* Match EventCarousel arrow placement */}
          <Skeleton className="absolute top-1/2 left-2 size-8 -translate-y-1/2 rounded-full sm:left-3" />
          <Skeleton className="absolute top-1/2 right-2 size-8 -translate-y-1/2 rounded-full sm:right-3" />
        </div>
      </div>

      {/* Match DisclaimerBanner styling exactly */}
      <section className="relative rounded-xl bg-chart-2/60 p-6 pr-12 shadow-sm dark:bg-chart-2/40">
        <Skeleton className="absolute top-3 right-3 h-8 w-8 rounded-md" />
        <h3 className="mb-2 font-semibold">Disclaimer</h3>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[96%]" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[78%]" />
        </div>
      </section>
    </div>
  )
}
