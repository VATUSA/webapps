import { Inter, Merriweather, JetBrains_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import LoginDropdown from "./login-dropdown"
import { getSession } from "@/lib/session"
import Link from "next/link"
import { ThemeSwitch } from "@/app/ThemeSwitch"

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
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession()
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="h-1 bg-linear-to-r from-red-700 via-white to-blue-900"></div>

          <header className="bg-vatusaBlue text-white shadow-md dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-md bg-white"></div>
                  <span className="text-lg font-semibold tracking-wide">
                    VATUSA
                  </span>
                </div>

                <nav className="hidden space-x-8 text-sm font-medium md:flex">
                  <Link href="/" className="transition hover:text-red-400">
                    Home
                  </Link>
                  <a href="#" className="transition hover:text-red-400">
                    Facilities
                  </a>
                  <a href="#" className="transition hover:text-red-400">
                    Pilots
                  </a>
                  <a href="#" className="transition hover:text-red-400">
                    Controllers
                  </a>
                  <a href="#" className="transition hover:text-red-400">
                    About
                  </a>
                </nav>

                <div className="flex items-center space-x-4">
                  <ThemeSwitch />
                  <LoginDropdown
                    isLoggedIn={session.isLoggedIn ?? false}
                    name={session.name}
                  />
                </div>
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <footer className="mt-16 bg-slate-900 text-gray-300">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm md:grid-cols-3">
              <div>
                <h4 className="mb-3 font-semibold text-white">About VATUSA</h4>
                <p className="text-gray-400">
                  VATUSA provides simulated air traffic control services across
                  the United States as part of the VATSIM global flight
                  simulation network.
                </p>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Facilities
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Training
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Policies
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-white">Network</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="transition hover:text-white">
                      VATSIM.net
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Status
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-700 py-4 text-center text-xs text-gray-500">
              © 2026 VATUSA. All rights reserved.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}