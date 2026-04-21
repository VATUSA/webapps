"use client"

import React from "react"
import { AlertTriangle } from "lucide-react"

export function DevBanner() {
  return (
    <div className="w-full bg-red-200 border-t border-red-300 shadow-sm flex items-center justify-center px-0 py-0 z-10 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3 w-full max-w-7xl mx-auto px-4 py-2">
        <span className="inline-flex items-center justify-center rounded-full bg-red-300 text-red-900 p-1.5 mr-1 shadow">
          <AlertTriangle className="w-5 h-5" />
        </span>
        <span className="text-sm md:text-base font-medium text-red-900">
          This application is{" "}
          <span className="font-bold">in development</span>. Many features are
          stubs or incomplete and indicate ongoing work.
        </span>
      </div>
    </div>
  )
}
