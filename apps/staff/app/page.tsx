import type { Metadata } from "next"
import { Card, CardContent } from "@workspace/ui/components/card"
import { decodeCobaltJwt } from "@workspace/third-party/cobalt"
import { cookies } from "next/headers"
import { normalizePermissionCollections } from "@/lib/acl"
import { createStaffPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Staff Home",
  description:
    "Overview of your staff profile, permissions, and staff session diagnostics.",
})

function getInitials(label: string) {
  const [first, second] = label.split(/\s+/).filter(Boolean)

  if (!first) return "?"
  if (!second) return first.slice(0, 2).toUpperCase()

  return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase()
}

function getPermissionLabel(permission: unknown) {
  if (typeof permission === "string") return permission
  if (
    permission &&
    typeof permission === "object" &&
    "object" in permission &&
    typeof permission.object === "string" &&
    "action" in permission &&
    typeof permission.action === "string"
  ) {
    return `${permission.object}:${permission.action}`
  }
  return JSON.stringify(permission)
}

function getAction(permission: unknown) {
  if (typeof permission === "string") {
    const parts = permission.split(":")
    return parts.length > 1 ? parts[parts.length - 1] : permission
  }
  if (
    permission &&
    typeof permission === "object" &&
    "action" in permission &&
    typeof permission.action === "string"
  ) {
    return permission.action
  }
  return "?"
}

export default async function Page() {
  const session = await decodeCobaltJwt(await cookies())

  const displayName = session?.display_name ?? "Staff member"
  const initials = getInitials(displayName)
  const cid = session?.cid != null ? String(session.cid) : "—"

  const {
    globalPermissions,
    facilityPermissionsByFacility,
    allFacilityPermissions,
  } = normalizePermissionCollections(session)

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="rounded-2xl border border-border/60 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-sm md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-white/70 uppercase">
              Staff Home
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome, {displayName}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-white/75">
              This is your staff home page.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-base font-semibold text-slate-950">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">{displayName}</p>
              <p className="text-sm text-white/60">CID {cid}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        <Card className="border-border/60 shadow-sm">
          <CardContent>
            <h2 className="text-lg font-semibold tracking-tight">
              Pre-production Information
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              The following is information based on your user and session. This will only be available on dev servers. Please provide this to a VATUSA dev should they ask for it.
            </p>
            <div className="mt-4">
              <h3 className="font-semibold">Global Permissions</h3>
              <ul className="list-disc list-inside text-xs text-muted-foreground">
                {globalPermissions.length === 0 && <li>None</li>}
                {globalPermissions.map((perm: unknown, idx: number) => (
                  <li key={idx}>
                    {getPermissionLabel(perm)} <span className="text-muted-foreground/70">({getAction(perm)})</span>
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold mt-3">Facility Permissions</h3>
              {Object.keys(facilityPermissionsByFacility).length === 0 && (
                <div className="text-xs text-muted-foreground">None</div>
              )}
              {Object.entries(facilityPermissionsByFacility).map(([fac, perms]) => {
                const permsArr = Array.isArray(perms) ? perms : []
                return (
                  <div key={fac} className="mt-1">
                    <div className="text-xs font-semibold text-foreground">{fac}</div>
                    <ul className="list-disc list-inside text-xs text-muted-foreground ml-4">
                      {permsArr.length === 0 && <li>None</li>}
                      {permsArr.map((perm: unknown, idx) => (
                        <li key={idx}>
                          {getPermissionLabel(perm)} <span className="text-muted-foreground/70">({getAction(perm)})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
              <h3 className="font-semibold mt-3">All Facility Permissions</h3>
              <ul className="list-disc list-inside text-xs text-muted-foreground">
                {allFacilityPermissions.length === 0 && <li>None</li>}
                {allFacilityPermissions.map((perm: unknown, idx: number) => (
                  <li key={idx}>
                    {getPermissionLabel(perm)} <span className="text-muted-foreground/70">({getAction(perm)})</span>
                  </li>
                ))}
              </ul>
            </div>
            {process.env.NODE_ENV === "development" && session && (
              <div className="mt-6">
                <h3 className="font-semibold">Raw JWT Session</h3>
                <pre className="whitespace-pre-wrap break-all rounded bg-black/80 p-3 text-xs text-green-200 border border-white/10 overflow-x-auto max-w-full">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
