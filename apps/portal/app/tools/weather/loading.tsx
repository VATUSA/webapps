import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function Loading() {
  return (
    <main className="container mx-auto max-w-6xl py-6">
      <section className="space-y-5 rounded-2xl border border-border/60 bg-card/95 p-6 shadow-sm sm:p-8">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full max-w-xl" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>

        <Skeleton className="h-px w-full" />

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-border/60 bg-muted/30">
            <CardContent className="space-y-4 py-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-52" />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-muted/30">
            <CardContent className="space-y-3 py-5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card className="border-border/60 bg-card/95">
          <CardHeader className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/95">
          <CardHeader className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

