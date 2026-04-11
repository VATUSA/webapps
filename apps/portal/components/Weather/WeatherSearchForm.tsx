"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { SearchIcon, XIcon } from "lucide-react"
import { isValidStationCode, normalizeStationCode } from "@/lib/weather"

type WeatherSearchFormProps = {
  initialStation: string
}


export default function WeatherSearchForm({ initialStation }: WeatherSearchFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = React.useState(initialStation)

  React.useEffect(() => {
    setValue(initialStation)
  }, [initialStation])

  const normalizedValue = normalizeStationCode(value)
  const hasValue = normalizedValue.length > 0
  const isValueValid = !hasValue || isValidStationCode(value)

  const pushStation = React.useCallback(
    (nextValue: string) => {
      const normalized = normalizeStationCode(nextValue)
      const params = new URLSearchParams(searchParams.toString())

      if (normalized) {
        params.set("station", normalized)
      } else {
        params.delete("station")
      }

      const nextQuery = params.toString()
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname)
    },
    [pathname, router, searchParams]
  )

  const submitSearch = React.useCallback(() => pushStation(value), [pushStation, value])

  const clearSearch = React.useCallback(() => {
    setValue("")
    pushStation("")
  }, [pushStation])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (hasValue && !isValueValid) return
    submitSearch()
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-sm sm:p-5">
      <form onSubmit={onSubmit} className="space-y-2">
        <label htmlFor="weather-station" className="text-sm font-medium">
          Airport code
        </label>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
          <Input
            id="weather-station"
            value={value}
            onChange={(event) => setValue(event.target.value.toUpperCase())}
            placeholder="KJFK, KLAX, KDEN, EGLL"
            autoComplete="off"
            spellCheck={false}
            inputMode="text"
            aria-invalid={hasValue && !isValueValid}
            className={cn(hasValue && !isValueValid && "border-destructive focus-visible:ring-destructive/20")}
          />

          <Button type="submit" className="w-full lg:w-auto" disabled={hasValue && !isValueValid}>
            <SearchIcon className="size-4" />
            Search
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full lg:w-auto"
            onClick={clearSearch}
            disabled={!hasValue}
          >
            <XIcon className="size-4" />
            Clear
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {hasValue && !isValueValid
            ? "Use a 3–5 character station code."
            : "Results update in the URL so you can bookmark or share a lookup."}
        </p>
      </form>
    </div>
  )
}

