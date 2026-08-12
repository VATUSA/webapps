import { Inter, Merriweather, JetBrains_Mono } from "next/font/google"
import type { Metadata } from "next"
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
import { decodeCobaltJwt } from "@workspace/third-party/cobalt"
import { cookies } from "next/headers"
import { requireStaffSession } from "@/lib/permissions"
import { DevBanner } from "@/components/Banner/DevBanner"
import { normalizePermissionCollections } from "@/lib/acl"
import { fetchAssignableRoles } from "@/lib/assignableRoles"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { STAFF_ROOT_METADATA } from "@/lib/metadata"
import { ThemeSwitch } from "@/components/Theme/ThemeSwitch"
import { HeaderBreadcrumb } from "@/components/SideBar/HeaderBreadcrumb"

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

export const metadata: Metadata = STAFF_ROOT_METADATA

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const session = await decodeCobaltJwt(cookieStore)
  const allowed = requireStaffSession(session)
  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections(session)
  const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false"
  const assignableRoles = allowed ? await fetchAssignableRoles() : {}

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} min-h-screen antialiased`}
      >
        <ClientThemeProvider>
          <TooltipProvider>
            {allowed ? (
              <SidebarProvider defaultOpen={sidebarOpen}>
                <AppSideBar
                  userName={session?.display_name}
                  globalPermissions={globalPermissions}
                  facilityPermissions={allFacilityPermissions}
                  homeFacility={session?.home_facility}
                  assignableRoles={assignableRoles}
                />

                <SidebarInset>
                  <DevBanner />
                  <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex flex-1 items-center gap-2 px-4">
                      <SidebarTrigger className="-ml-1" />
                      <Separator
                        orientation="vertical"
                        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                      />
                      <HeaderBreadcrumb />
                    </div>
                    <div className="flex items-center gap-2 px-4">
                      <ThemeSwitch />
                    </div>
                  </header>

                  <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
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
