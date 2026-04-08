"use client"

import * as React from "react"
import { MailIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"

export type MemberEntry = {
  id: string
  name: string
  cid: number
  facility: string
}

export type FacilityStaffEntry = {
  id: string
  position: string
  name: string
  email?: string
}

export type FacilityRoster = {
  id: string
  facility: string
  staff: FacilityStaffEntry[]
  members: MemberEntry[]
}

type MembersSearchProps = {
  rosters: FacilityRoster[]
}

export default function MembersSearch({ rosters }: MembersSearchProps) {
  const [selectedFacilityId, setSelectedFacilityId] = React.useState("")
  const [query, setQuery] = React.useState("")

  const selectedRoster = React.useMemo(
    () => rosters.find((roster) => roster.id === selectedFacilityId),
    [rosters, selectedFacilityId]
  )

  const filteredResults = React.useMemo(() => {
    if (!selectedRoster) {
      return { staff: [] as FacilityStaffEntry[], members: [] as MemberEntry[] }
    }

    const q = query.trim().toLowerCase()
    if (!q) {
      return {
        staff: selectedRoster.staff,
        members: selectedRoster.members,
      }
    }

    return {
      staff: selectedRoster.staff.filter((staffEntry) => {
        return (
          staffEntry.name.toLowerCase().includes(q) ||
          staffEntry.position.toLowerCase().includes(q) ||
          (staffEntry.email ?? "").toLowerCase().includes(q)
        )
      }),
      members: selectedRoster.members.filter((member) => {
        return (
          member.name.toLowerCase().includes(q) ||
          String(member.cid).includes(q)
        )
      }),
    }
  }, [query, selectedRoster])

  return (
    <Card className="border-border/60 bg-card/95">
      <CardHeader>
        <CardTitle>Members Search</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">Select a facility</span>
            <select
              className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={selectedFacilityId}
              onChange={(event) => {
                setSelectedFacilityId(event.target.value)
                setQuery("")
              }}
              aria-label="Select facility"
            >
              <option value="">Choose a facility...</option>
              {rosters.map((roster) => (
                <option key={roster.id} value={roster.id}>
                  {roster.facility}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Search within facility</span>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, CID, position, or email..."
              aria-label="Search within selected facility"
              disabled={!selectedRoster}
            />
          </label>
        </div>

        {!selectedRoster ? (
          <p className="rounded-md border border-dashed border-border/70 px-4 py-6 text-sm text-muted-foreground">
            Select a facility to view and search staff and members.
          </p>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {selectedRoster.facility}
            </h3>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Facility Staff
              </h4>
              {filteredResults.staff.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No staff match your search.
                </p>
              ) : (
                <ul className="divide-y divide-border/60 overflow-hidden rounded-md border border-border/60">
                  {filteredResults.staff.map((staffEntry) => (
                    <li
                      key={staffEntry.id}
                      className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-accent/50 focus-within:bg-accent/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {staffEntry.position}
                        </p>
                        <p className="text-sm text-muted-foreground transition-colors group-hover:text-foreground/80">
                          {staffEntry.name}
                        </p>
                      </div>
                      {staffEntry.email ? (
                        <a
                          href={`mailto:${staffEntry.email}`}
                          aria-label={`Email ${staffEntry.name}`}
                          className="inline-flex size-8 items-center justify-center rounded-md border border-border/60 bg-transparent text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground group-hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          <MailIcon className="size-4" />
                          <span className="sr-only">Email {staffEntry.name}</span>
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Facility Members
              </h4>
              {filteredResults.members.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No members match your search.
                </p>
              ) : (
                <ul className="divide-y divide-border/60 overflow-hidden rounded-md border border-border/60">
                  {filteredResults.members.map((member) => (
                    <li
                      key={member.id}
                      className="group px-4 py-3 transition-colors hover:bg-accent/50 focus-within:bg-accent/50"
                    >
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground transition-colors group-hover:text-foreground/80">
                        CID {member.cid}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
