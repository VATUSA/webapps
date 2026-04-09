import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"

export default function Loading() {
  return (
    <main className="container mx-auto py-6">
      <Card className="border-border/60 bg-card/95">
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-9/12" />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
