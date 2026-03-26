import { Inter, Merriweather, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/Theme/theme-provider"
import { getSession } from "@/lib/session"
import NavBar from "@/components/NavBar/NavBar"
import "./globals.css"
import Footer from "@/components/Footer/Footer"
import React from "react"

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
          <div className="flex min-h-screen flex-col">
            <NavBar session={session} />
              <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}