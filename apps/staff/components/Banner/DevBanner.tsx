import { AlertTriangle } from "lucide-react"

export function DevBanner() {
  return (
    <div className="flex w-full items-center justify-center border-b border-amber-300 bg-amber-100 dark:border-amber-500/30 dark:bg-amber-950/40">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2">
        <span className="inline-flex items-center justify-center rounded-full bg-amber-300 p-1.5 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium text-amber-900 md:text-base dark:text-amber-200">
          This application is <span className="font-bold">in development</span>.
          Many features are stubs or incomplete and indicate ongoing work.
        </span>
      </div>
    </div>
  )
}
