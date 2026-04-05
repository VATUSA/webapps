"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/Theme/theme-provider"

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeProvider>{children}</ThemeProvider>
}

