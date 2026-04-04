import { Inter, Merriweather, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/Theme/theme-provider"
import { Toaster } from "@workspace/ui/components/sonner"
import { getSession } from "@/lib/session"
import React from "react"
import "./globals.css"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontSerif = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>
              <div className="flex min-h-screen flex-col">
                <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
                  {children}
                </div>
                <Toaster />
              </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
