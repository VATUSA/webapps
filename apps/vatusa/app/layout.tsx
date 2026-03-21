import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import ThemeSwitch from "./theme-switch";
import LoginDropdown from "./login-dropdown";
import { getSession } from "@/lib/session";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VATUSA",
  description: "VATUSA, part of VATSIM",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>VATUSA - Virtual Air Traffic Control</title>
      </head>

      <body className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
        <ThemeProvider attribute="class">
          <div className="h-1 bg-linear-to-r from-red-700 via-white to-blue-900"></div>

          <header className="bg-vatusaBlue dark:bg-slate-950 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-white rounded-md"></div>
                  <span className="font-semibold text-lg tracking-wide">
                    VATUSA
                  </span>
                </div>

                <nav className="hidden md:flex space-x-8 text-sm font-medium">
                  <Link href="/" className="hover:text-red-400 transition">
                    Home
                  </Link>
                  <a href="#" className="hover:text-red-400 transition">
                    Facilities
                  </a>
                  <a href="#" className="hover:text-red-400 transition">
                    Pilots
                  </a>
                  <a href="#" className="hover:text-red-400 transition">
                    Controllers
                  </a>
                  <a href="#" className="hover:text-red-400 transition">
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

          <footer className="bg-slate-900 text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="font-semibold text-white mb-3">About VATUSA</h4>
                <p className="text-gray-400">
                  VATUSA provides simulated air traffic control services across
                  the United States as part of the VATSIM global flight
                  simulation network.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Facilities
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Training
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Policies
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Network</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition">
                      VATSIM.net
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Status
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition">
                      Discord
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-700 text-center text-xs py-4 text-gray-500">
              © 2026 VATUSA. All rights reserved.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
