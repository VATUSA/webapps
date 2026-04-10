"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div
      key={pathname}
      className="motion-safe:animate-in motion-safe:fade-in duration-150"
    >
      {children}
    </div>
  )
}
