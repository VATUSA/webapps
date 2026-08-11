import Image from "next/image"
import Link from "next/link"
import { ThemeSwitch } from "@/components/Theme/ThemeSwitch"
import SessionMenu from "@/components/NavBar/SessionMenu"
import { NavButtons } from "@/components/NavBar/NavButtons"
import { MobileNav } from "@/components/NavBar/MobileNav"

export default function NavBar() {
  const myVatusaProfileUrl = "/legacy/my/profile"
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

          <div className="hidden lg:block">
            <NavButtons />
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeSwitch />
            <SessionMenu
              myVatusaProfileUrl={myVatusaProfileUrl}
              staffAppUrl={staffAppUrl}
              cobaltBaseUrl={cobaltBaseUrl}
            />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
