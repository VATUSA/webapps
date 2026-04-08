import { Skeleton } from "@workspace/ui/components/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto space-y-8">
      {/* Page Title Skeleton */}
      <Skeleton className="h-10 w-48 rounded-lg" />

      {/* Generic Content Skeletons */}
      <div className="space-y-4">
        {/* Hero/Featured Section */}
        <Skeleton className="aspect-video w-full rounded-xl" />

        {/* Content Paragraphs */}
        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Cards Grid Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-lg border border-border/50 p-4"
          >
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>

      {/* Additional Content Section */}
      <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
        <Skeleton className="h-5 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  )
}
