import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { formatUtc, type WeatherLookupResult } from "@/lib/weather"

type WeatherResultsProps = {
  result: WeatherLookupResult
}

function RawReportBlock({
  title,
  rawText,
}: {
  title: string
  rawText: string
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      <pre className="max-h-80 overflow-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
        {rawText || "Raw report not available."}
      </pre>
    </div>
  )
}

function ReportCard({
  title,
  report,
  emptyText,
}: {
  title: string
  report: WeatherLookupResult["metar"]
  emptyText: string
}) {
  return (
    <Card className="border-border/60 bg-card/95 shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">{title}</CardTitle>
          <span className="rounded-full border border-border/60 bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Raw report
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {report ? (
          <RawReportBlock title={`Raw ${title}`} rawText={report.rawText} />
        ) : (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function WeatherResults({ result }: WeatherResultsProps) {
  const hasWeather = Boolean(result.metar || result.taf)

  return (
    <section className="space-y-4">
      <Card className="border-border/60 bg-card/95 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-2xl tracking-tight">{result.stationId}</CardTitle>
            <span className="rounded-full border border-border/60 bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Fetched {formatUtc(result.fetchedAt) ?? "just now"}
            </span>
          </div>
        </CardHeader>
        {result.warnings.length || result.errors.length ? (
          <CardContent className="pt-0">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-100">
              <p className="font-medium">Some data could not be loaded.</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {result.errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
                {result.warnings.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        ) : null}
      </Card>

      {hasWeather ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <ReportCard
            title="METAR"
            report={result.metar}
            emptyText="No METAR report was returned for this airport code."
          />
          <ReportCard
            title="TAF"
            report={result.taf}
            emptyText="No TAF report was returned for this airport code."
          />
        </div>
      ) : (
        <Card className="border-border/60 bg-card/95 shadow-sm">
          <CardContent className="py-10 text-sm text-muted-foreground">
            No weather reports were returned for this airport code.
          </CardContent>
        </Card>
      )}
    </section>
  )
}
