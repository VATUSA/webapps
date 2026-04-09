import { Card, CardContent } from "@workspace/ui/components/card"
import { getSession } from "@/lib/session"

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
  const facility = cobaltUser?.division_user.facility ?? "—"

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

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="space-y-2 p-4">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Current Facility
            </p>
            <h2 className="text-lg font-semibold">{facility}</h2>
            <p className="text-sm text-muted-foreground">
              Your current session is tied to this facility.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="space-y-2 p-4">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Session
            </p>
            <h2 className="text-lg font-semibold">Signed in</h2>
            <p className="text-sm text-muted-foreground">
              You’re ready to use the staff portal.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
