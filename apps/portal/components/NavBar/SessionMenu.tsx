"use client"

import { useEffect, useState } from "react"
import LoginDropdown from "@/components/LoginButton/LoginButton"
import type { CobaltJwtPayload } from "@/lib/auth"

type SessionMenuProps = {
  myVatusaProfileUrl: string
  staffAppUrl: string
  cobaltBaseUrl: string
}

/**
 * Client-side session island.
 *
 * The root layout deliberately does not read `cookies()` — doing so forces every
 * route in the app to render dynamically and makes the site uncacheable at the
 * CDN. Instead the shell renders logged-out and this component swaps in the user
 * menu once `/api/session` resolves.
 */
export default function SessionMenu({
  myVatusaProfileUrl,
  staffAppUrl,
  cobaltBaseUrl,
}: SessionMenuProps) {
  const [session, setSession] = useState<CobaltJwtPayload | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const res = await fetch("/api/session", { cache: "no-store" })
        if (!res.ok) return

        const data: { session: CobaltJwtPayload | null } = await res.json()
        if (active) setSession(data.session)
      } catch {
        // Stay logged-out on failure; the login link remains usable.
      }
    }

    void load()

    // Pick up a login/logout that happened in another tab.
    function onVisibility() {
      if (document.visibilityState === "visible") void load()
    }

    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      active = false
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <LoginDropdown
      isLoggedIn={session !== null}
      name={session?.display_name ?? undefined}
      myVatusaProfileUrl={myVatusaProfileUrl}
      staffAppUrl={staffAppUrl}
      canAccessStaffApp={session?.is_staff ?? false}
      cobaltBaseUrl={cobaltBaseUrl}
    />
  )
}
