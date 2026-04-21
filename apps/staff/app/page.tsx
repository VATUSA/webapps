import { Card, CardContent } from "@workspace/ui/components/card"
import { getSession } from "@/lib/session"
import { normalizePermissionCollections } from "@/lib/acl"

function getDisplayName({
  name,
  cid,
  sessionName,
  firstName,
  lastName,
}: {
  name?: string
  cid?: string
  sessionName?: string
  firstName?: string
  lastName?: string
}) {
  if (name?.trim()) return name.trim()
  if (sessionName?.trim()) return sessionName.trim()
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim()
  if (fullName) return fullName
  if (cid?.trim()) return `CID ${cid.trim()}`
  return "Staff member"
}

function getInitials(label: string) {
  const [first, second] = label.split(/\s+/).filter(Boolean)

  if (!first) return "?"
  if (!second) return first.slice(0, 2).toUpperCase()

  return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase()
}

export default async function Page() {
  const session = await getSession()
  const cobaltUser = session.cobalt?.user

  const displayName = getDisplayName({
    name: session.name,
    cid: session.cid,
    firstName: cobaltUser?.network_user.first_name,
    lastName: cobaltUser?.network_user.last_name,
    sessionName: cobaltUser?.division_user.display_name ?? undefined,
  })

  const initials = getInitials(displayName)
  const cid = session.cid ?? String(cobaltUser?.cid ?? "—")
  const cobalt = session.cobalt
  const {
    globalPermissions,
    facilityPermissionsByFacility,
    allFacilityPermissions,
  } = normalizePermissionCollections(cobalt)

  function getAction(permission: unknown) {
    if (typeof permission === "string") {
      const parts = permission.split(":")
      return parts.length > 1 ? parts[parts.length - 1] : permission
    }
    if (permission && typeof permission === "object" && "action" in permission && typeof permission.action === "string") {
      return permission.action
    }
    return "?"
  }

  function getPermissionLabel(permission: unknown) {
    if (typeof permission === "string") return permission
    if (permission && typeof permission === "object" && "object" in permission && typeof permission.object === "string" && "action" in permission && typeof permission.action === "string") {
      return `${permission.object}:${permission.action}`
    }
    return JSON.stringify(permission)
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 pt-0">
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
            <p className="max-w-2xl text-sm leading-6 text-white/75">
              The following is information based on your user and session. This will only be available on dev servers. Please provide this to a VATUSA dev should they ask for it.
            </p>
            <div className="mt-4">
              <h3 className="font-semibold">Global Permissions</h3>
              <ul className="list-disc list-inside text-xs text-white/80">
                {globalPermissions.length === 0 && <li>None</li>}
                {globalPermissions.map((perm: unknown, idx: number) => (
                  <li key={idx}>
                    {getPermissionLabel(perm)} <span className="text-white/50">({getAction(perm)})</span>
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold mt-3">Facility Permissions</h3>
              {Object.keys(facilityPermissionsByFacility).length === 0 && (
                <div className="text-xs text-white/80">None</div>
              )}
              {Object.entries(facilityPermissionsByFacility).map(([fac, perms]) => {
                const permsArr = Array.isArray(perms) ? perms : []
                return (
                  <div key={fac} className="mt-1">
                    <div className="text-xs font-semibold text-white/70">{fac}</div>
                    <ul className="list-disc list-inside text-xs text-white/80 ml-4">
                      {permsArr.length === 0 && <li>None</li>}
                      {permsArr.map((perm: unknown, idx) => (
                        <li key={idx}>
                          {getPermissionLabel(perm)} <span className="text-white/50">({getAction(perm)})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
              <h3 className="font-semibold mt-3">All Facility Permissions</h3>
              <ul className="list-disc list-inside text-xs text-white/80">
                {allFacilityPermissions.length === 0 && <li>None</li>}
                {allFacilityPermissions.map((perm: unknown, idx: number) => (
                  <li key={idx}>
                    {getPermissionLabel(perm)} <span className="text-white/50">({getAction(perm)})</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Raw session JSON for debugging (dev only) */}
            {process.env.NODE_ENV === "development" && cobalt && (
              <div className="mt-6">
                <h3 className="font-semibold">Raw Cobalt Session JSON</h3>
                <pre className="whitespace-pre-wrap break-all rounded bg-black/80 p-3 text-xs text-green-200 border border-white/10 overflow-x-auto max-w-full">
                  {JSON.stringify(cobalt, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
