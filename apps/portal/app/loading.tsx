import { Skeleton } from "@workspace/ui/components/skeleton"

export default function Loading() {
  return (
    <main className="container mx-auto py-6">
      <div className="animate-in fade-in duration-150">
        <Skeleton className="h-[60vh] w-full rounded-xl" />
      </div>
    </main>
  )
}
