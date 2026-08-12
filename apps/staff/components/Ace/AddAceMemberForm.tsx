"use client"

import * as React from "react"
import { toast } from "sonner"
import { Input } from "@workspace/ui/components/input"
import { FormErrorToast } from "@/components/Form/FormErrorToast"
import {
  addAceTeamMemberAction,
  searchAceCandidatesAction,
  type AceActionState,
  type AceCandidate,
} from "@/actions/ace"

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 250

// Declared here, not in the action module: a "use server" file may only export
// async functions, so a plain object export there is a build error.
const initialState: AceActionState = {
  error: null,
  success: null,
}

type AddAceMemberFormProps = {
  /** CIDs already on the team, so they can be kept out of the suggestions. */
  existingCids?: number[]
}

export default function AddAceMemberForm({
  existingCids = [],
}: AddAceMemberFormProps) {
  const [state, formAction] = React.useActionState(
    addAceTeamMemberAction,
    initialState
  )
  const [query, setQuery] = React.useState("")
  const [candidates, setCandidates] = React.useState<AceCandidate[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  const existing = React.useMemo(
    () => new Set(existingCids.map(String)),
    [existingCids]
  )

  // A CID already on the roster would be rejected by cobalt with a 409, so flag
  // it before the round trip.
  const isDuplicate = existing.has(query.trim())

  const lastSuccessRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!state.success) {
      lastSuccessRef.current = null
      return
    }

    if (state.success === lastSuccessRef.current) return

    lastSuccessRef.current = state.success
    toast.success(state.success)
    setQuery("")
    setCandidates([])
  }, [state.success])

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
          setCandidates(results.filter((r) => !existing.has(String(r.cid))))
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
  }, [query, existing])

  function selectCandidate(candidate: AceCandidate) {
    setQuery(String(candidate.cid))
    setCandidates([])
  }

  return (
    <form
      action={formAction}
      onSubmit={() => setCandidates([])}
      className="flex flex-col gap-2 sm:flex-row sm:items-start"
    >
      <FormErrorToast error={state.error} title="Could not add member" />

      <div className="relative w-full sm:max-w-xs">
        <Input
          name="cid"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Add by CID or name"
          autoComplete="off"
          aria-label="Controller CID or name"
          aria-invalid={isDuplicate || undefined}
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

        {isDuplicate ? (
          <p className="mt-1 text-xs text-destructive">
            Already on the ACE Team.
          </p>
        ) : isSearching && candidates.length === 0 ? (
          <p className="mt-1 text-xs text-muted-foreground">Searching…</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isDuplicate}
        className="inline-flex h-9 items-center justify-center rounded-md border border-transparent bg-primary px-4 text-sm font-medium whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        Add
      </button>
    </form>
  )
}
