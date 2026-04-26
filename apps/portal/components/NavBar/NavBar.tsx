import Image from "next/image"
import Link from "next/link"
import { ThemeSwitch } from "@/components/Theme/ThemeSwitch"
import LoginDropdown from "@/components/LoginButton/LoginButton"
import type { CobaltJwtPayload } from "@/lib/auth"
import { NavButtons } from "@/components/NavBar/NavButtons"
import { MobileNav } from "@/components/NavBar/MobileNav"
import { hasStaffAccess } from "@workspace/third-party/acl"

interface NavBarProps {
  session: CobaltJwtPayload | null
}

export default function NavBar({ session }: NavBarProps) {
  const globalPermissions = session?.global_permissions ?? []
  const facilityPermissions = session?.facility_permissions ?? []
  const isStaff = hasStaffAccess([...globalPermissions, ...facilityPermissions])
  const name = session?.display_name ?? undefined

  const myVatusaProfileUrl =
    process.env.NEXT_PUBLIC_MY_VATUSA_PROFILE_URL ?? "/my/profile"
  const staffAppUrl = process.env.NEXT_PUBLIC_STAFF_APP_URL ?? "/staff"
  const cobaltBaseUrl =
    process.env.NEXT_PUBLIC_COBALT_EXTERNAL_BASE_URL ??
    "http://localhost:8000/cobalt"

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 text-card-foreground shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="VATUSA Home"
              className="inline-flex items-center"
            >
              <Image
                src="/VATUSA-LOGO-FULLCOLOR.png"
                alt="VATUSA"
                width={220}
                height={48}
                priority
                className="h-9 w-auto dark:hidden"
              />
              <Image
                src="/VATUSA-LOGO-FULLCOLOR-ALT.png"
                alt="VATUSA"
                width={220}
                height={48}
                priority
                className="hidden h-9 w-auto dark:block"
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <NavButtons />
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeSwitch />
            <LoginDropdown
              isLoggedIn={session !== null}
              name={name}
              myVatusaProfileUrl={myVatusaProfileUrl}
              staffAppUrl={staffAppUrl}
              canAccessStaffApp={isStaff}
              cobaltBaseUrl={cobaltBaseUrl}
            />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
