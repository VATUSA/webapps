import { Inter, Merriweather, JetBrains_Mono } from "next/font/google"
import ClientThemeProvider from "@/components/Theme/ClientThemeProvider"
import { Toaster } from "@workspace/ui/components/sonner"
import React from "react"
import "./globals.css"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { AppSideBar } from "@/components/SideBar/AppSideBar"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { getSession } from "@/lib/session"
import { requireStaffSession } from "@/lib/permissions"
import { DevBanner } from "@/components/Banner/DevBanner"
import { normalizePermissionCollections } from "@/lib/acl"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"

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
  const allowed = requireStaffSession(session)
  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections(session.cobalt)

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} min-h-screen antialiased`}
      >
        <ClientThemeProvider>
          <TooltipProvider>
            {allowed ? (
              <div className="flex min-h-screen flex-col">
                <DevBanner />
                <SidebarProvider>
                  <AppSideBar
                    userName={session?.name}
                    globalPermissions={globalPermissions}
                    facilityPermissions={allFacilityPermissions}
                  />

                  <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                      <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                          orientation="vertical"
                          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                        />
                      </div>
                    </header>

                    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
                      {children}
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </div>
            ) : (
              <UnauthorizedPanel
                message="You are not authorized to access the staff application."
                backHref="/"
                backLabel="Back to Staff Home"
                toastMessage="You are not authorized to access the staff application."
              />
            )}
            <Toaster />
          </TooltipProvider>
        </ClientThemeProvider>
      </body>
    </html>
  )
}
