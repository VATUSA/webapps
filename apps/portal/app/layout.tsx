import { Inter, Merriweather, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/Theme/theme-provider"
import NavBar from "@/components/NavBar/NavBar"
import "./globals.css"
import Footer from "@/components/Footer/Footer"
import React from "react"
import { Toaster } from "@workspace/ui/components/sonner"

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

// NOTE: this layout must not read `cookies()`/`headers()`. A request-time API
// read here forces every route in the app to render dynamically, which makes the
// whole site uncacheable at the CDN. Session state is fetched client-side by
// <SessionMenu />.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
