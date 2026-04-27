"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { SelectField } from "@workspace/ui/components/select-field"
import { fetchFacilityRoster } from "@/actions/roster"

type FacilityOption = {
  id: string
  label: string
}

// Kept for compatibility with current imports/caller shape.
export type FacilityRoster = {
  id: string
  facility: string
  staff: unknown[]
  members: unknown[]
}

type RosterUser = {
  cid: number
  network_user: {
    first_name: string
    last_name: string
  }
  division_user: {
    display_name: string | null
    facility: string
    visiting_facilities: string[]
  }
}

type CobaltFacilityRoster = {
  home: RosterUser[]
  visitors: RosterUser[] | null
}

type MembersSearchProps = {
  facilities?: FacilityOption[]
  rosters?: FacilityRoster[]
}

const DEFAULT_ARTCC_OPTIONS: FacilityOption[] = [
  { id: "ZAB", label: "Albuquerque ARTCC (ZAB)" },
  { id: "ZAN", label: "Anchorage ARTCC (ZAN)" },
  { id: "ZAU", label: "Chicago ARTCC (ZAU)" },
  { id: "ZBW", label: "Boston ARTCC (ZBW)" },
  { id: "ZDC", label: "Washington ARTCC (ZDC)" },
  { id: "ZDV", label: "Denver ARTCC (ZDV)" },
  { id: "ZFW", label: "Fort Worth ARTCC (ZFW)" },
  { id: "ZHU", label: "Houston ARTCC (ZHU)" },
  { id: "ZID", label: "Indianapolis ARTCC (ZID)" },
  { id: "ZJX", label: "Jacksonville ARTCC (ZJX)" },
  { id: "ZKC", label: "Kansas City ARTCC (ZKC)" },
  { id: "ZLA", label: "Los Angeles ARTCC (ZLA)" },
  { id: "ZLC", label: "Salt Lake City ARTCC (ZLC)" },
  { id: "ZMA", label: "Miami ARTCC (ZMA)" },
  { id: "ZME", label: "Memphis ARTCC (ZME)" },
  { id: "ZMP", label: "Minneapolis ARTCC (ZMP)" },
  { id: "ZNY", label: "New York ARTCC (ZNY)" },
  { id: "ZOA", label: "Oakland ARTCC (ZOA)" },
  { id: "ZOB", label: "Cleveland ARTCC (ZOB)" },
  { id: "ZSE", label: "Seattle ARTCC (ZSE)" },
  { id: "ZTL", label: "Atlanta ARTCC (ZTL)" },
]

function getDisplayName(user: RosterUser): string {
  const display = user.division_user.display_name?.trim()
  if (display) return display
  return `${user.network_user.first_name} ${user.network_user.last_name}`.trim()
}

function matchesQuery(user: RosterUser, q: string): boolean {
  if (!q) return true

  const displayName = getDisplayName(user).toLowerCase()
  const cid = String(user.cid)

  return displayName.includes(q) || cid.includes(q)
}

export default function MembersSearch({
  facilities = DEFAULT_ARTCC_OPTIONS,
}: MembersSearchProps) {
  const [selectedFacilityId, setSelectedFacilityId] = React.useState("")
  const [query, setQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [roster, setRoster] = React.useState<CobaltFacilityRoster | null>(null)

  const selectedFacility = React.useMemo(
    () => facilities.find((facility) => facility.id === selectedFacilityId),
    [facilities, selectedFacilityId]
  )

  React.useEffect(() => {
    if (!selectedFacilityId) {
      setRoster(null)
      setError(null)
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function loadRoster() {
      setIsLoading(true)
      setError(null)

      try {
        const next = await fetchFacilityRoster(selectedFacilityId)
        if (!cancelled) {
          setRoster(next)
        }
      } catch {
        if (!cancelled) {
          setRoster(null)
          setError("Could not load roster. Please try again.")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadRoster()

    return () => {
      cancelled = true
    }
  }, [selectedFacilityId])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const home = (roster?.home ?? []).filter((user) => matchesQuery(user, q))
    const visitors = (roster?.visitors ?? []).filter((user) =>
      matchesQuery(user, q)
    )
    return { home, visitors }
  }, [query, roster])

  return (
    <Card className="border-border/60 bg-card/95">
      <CardHeader>
        <CardTitle>Members Search</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">Select an ARTCC</span>
            <SelectField
              value={selectedFacilityId}
              onValueChange={(value) => {
                setSelectedFacilityId(value)
                setQuery("")
              }}
              aria-label="Select ARTCC"
              placeholder="Choose an ARTCC..."
              options={facilities.map((facility) => ({
                value: facility.id,
                label: facility.label,
              }))}
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Search selected roster</span>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or CID..."
              aria-label="Search selected roster"
              disabled={!selectedFacilityId || isLoading}
            />
          </label>
        </div>

        {!selectedFacilityId ? (
          <p className="rounded-md border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
            Select an ARTCC to load and search home/visiting rosters.
          </p>
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground">Loading roster...</p>
        ) : error ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {selectedFacility?.label ?? selectedFacilityId}
            </h3>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Home Roster
              </h4>
              {filtered.home.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No home roster members match your search.
                </p>
              ) : (
                <ul className="divide-y divide-border/60 overflow-hidden rounded-md border border-border/60">
                  {filtered.home.map((member) => {
                    const name = getDisplayName(member)
                    return (
                      <li
                        key={`home-${member.cid}`}
                        className="group px-4 py-3 transition-colors focus-within:bg-accent/50 hover:bg-accent/50"
                      >
                        <p className="font-medium text-foreground">{name}</p>
                        <p className="text-sm text-muted-foreground transition-colors group-hover:text-foreground/80">
                          CID {member.cid}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Visiting Roster
              </h4>
              {filtered.visitors.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No visiting roster members match your search.
                </p>
              ) : (
                <ul className="divide-y divide-border/60 overflow-hidden rounded-md border border-border/60">
                  {filtered.visitors.map((member) => {
                    const name = getDisplayName(member)
                    return (
                      <li
                        key={`visitor-${member.cid}`}
                        className="group px-4 py-3 transition-colors focus-within:bg-accent/50 hover:bg-accent/50"
                      >
                        <p className="font-medium text-foreground">{name}</p>
                        <p className="text-sm text-muted-foreground transition-colors group-hover:text-foreground/80">
                          CID {member.cid}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
