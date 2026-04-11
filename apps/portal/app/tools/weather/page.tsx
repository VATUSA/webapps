import { type Metadata } from "next"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import WeatherSearchForm from "@/components/Weather/WeatherSearchForm"
import WeatherResults from "@/components/Weather/WeatherResults"
import { fetchAirportWeather, normalizeStationCode } from "@/lib/weather"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Weather Tool | VATUSA",
  description:
    "Look up raw METAR and TAF weather reports for airports using Aviation Weather Center.",
}

type WeatherPageProps = {
  searchParams: Promise<{ station?: string; icao?: string }>
}

export default async function Page({ searchParams }: WeatherPageProps) {
  const resolvedSearchParams = await searchParams
  const rawStation = resolvedSearchParams.station ?? resolvedSearchParams.icao ?? ""
  const normalizedStation = normalizeStationCode(rawStation)
  const hasStationInput = rawStation.trim().length > 0
  const isStationValid = !hasStationInput || /^[A-Z0-9]{3,5}$/.test(normalizedStation)

  const weather =
    isStationValid && normalizedStation
      ? await fetchAirportWeather(normalizedStation)
      : null

  return (
    <main className="container mx-auto max-w-6xl py-6">
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-6 shadow-sm sm:p-8">
        <div className="absolute inset-0 bg-linear-to-br from-sky-500/8 via-transparent to-indigo-500/8" />
        <div className="relative space-y-5">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
              Pilot Tools
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Airport Weather Lookup
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Enter an airport code to fetch the raw METAR and TAF reports from
              the Aviation Weather Center.
            </p>
          </div>

          <Separator />

          <WeatherSearchForm initialStation={normalizedStation} />
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {hasStationInput && !isStationValid ? (
          <Card className="border-border/60 bg-card/95 shadow-sm">
            <CardContent className="py-8 text-sm text-muted-foreground">
              Please enter a valid airport code.
            </CardContent>
          </Card>
        ) : null}

        {!hasStationInput ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-sm text-muted-foreground">
            Search for any station code to load the raw METAR and TAF reports.
          </div>
        ) : null}

        {weather ? <WeatherResults result={weather} /> : null}
      </section>
    </main>
  )
}
