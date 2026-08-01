"use client"

import * as React from "react"
import { Input } from "@workspace/ui/components/input"
import {
  addAceTeamMemberAction,
  searchAceCandidatesAction,
  type AceCandidate,
} from "@/actions/ace"

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 250

export default function AddAceMemberForm() {
  const [query, setQuery] = React.useState("")
  const [candidates, setCandidates] = React.useState<AceCandidate[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  React.useEffect(() => {
    const trimmed = query.trim()

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setCandidates([])
      setIsSearching(false)
      return
    }

    let cancelled = false
    setIsSearching(true)

    const timeout = window.setTimeout(() => {
      searchAceCandidatesAction(trimmed)
        .then((results) => {
          if (cancelled) return
          setCandidates(results)
        })
        .catch(() => {
          if (cancelled) return
          setCandidates([])
        })
        .finally(() => {
          if (cancelled) return
          setIsSearching(false)
        })
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [query])

  function selectCandidate(candidate: AceCandidate) {
    setQuery(String(candidate.cid))
    setCandidates([])
  }

  return (
    <form
      action={addAceTeamMemberAction}
      onSubmit={() => setCandidates([])}
      className="flex flex-col gap-2 sm:flex-row sm:items-start"
    >
      <div className="relative w-full sm:max-w-xs">
        <Input
          name="cid"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Add by CID or name"
          autoComplete="off"
          aria-label="Controller CID or name"
        />

        {candidates.length > 0 ? (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border/60 bg-popover shadow-md">
            {candidates.map((candidate) => (
              <li key={candidate.cid}>
                <button
                  type="button"
                  onClick={() => selectCandidate(candidate)}
                  className="flex w-full items-baseline justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  <span className="font-medium text-foreground">
                    {candidate.name}
                  </span>
                  <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                    {candidate.cid}
                    {candidate.facility ? ` · ${candidate.facility}` : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {isSearching && candidates.length === 0 ? (
          <p className="mt-1 text-xs text-muted-foreground">Searching…</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="inline-flex h-9 items-center justify-center rounded-md border border-transparent bg-primary px-4 text-sm font-medium whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        Add
      </button>
    </form>
  )
}
