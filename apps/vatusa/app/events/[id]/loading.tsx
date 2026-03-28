import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function Loading() {
  return (
    <main className="container mx-auto py-6">
      <Card className="overflow-hidden border-border/60 bg-card/95">
        <Skeleton className="h-[240px] w-full" />
        <CardHeader className="space-y-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
        </CardContent>
      </Card>
    </main>
  )
}
