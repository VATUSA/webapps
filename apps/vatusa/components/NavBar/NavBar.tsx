import Link from "next/link"
import { ThemeSwitch } from "@/components/Theme/ThemeSwitch"
import LoginDropdown from "@/components/LoginButton/LoginButton"
import type { UserSession } from "@/lib/session"
import { NavButtons } from "@/components/NavBar/NavButtons"

interface NavBarProps {
  session: UserSession
}

export default function NavBar({ session }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 text-card-foreground shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-md border border-border bg-muted" />
            <Link href="/" className="text-lg font-semibold tracking-wide">
              VATUSA
            </Link>
          </div>

          <NavButtons />

          <div className="flex items-center space-x-4">
            <ThemeSwitch />
            <LoginDropdown
              isLoggedIn={session.isLoggedIn}
              name={session.name}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
