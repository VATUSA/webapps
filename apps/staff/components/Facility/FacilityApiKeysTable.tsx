import type { CobaltV3ApiKey } from "@workspace/third-party/cobalt"
import { Card, CardContent } from "@workspace/ui/components/card"

function formatDateTime(value: number | null) {
  if (!value) return "-"
  const date = new Date(value * 1000)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toUTCString()
}

function TestingBadge({ testing }: { testing: boolean }) {
  const cls = testing
    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${cls}`}>
      {testing ? "Testing" : "Live"}
    </span>
  )
}

export default function FacilityApiKeysTable({
  keys,
}: {
  keys: CobaltV3ApiKey[]
}) {
  if (keys.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No API v3 keys have been issued for this facility yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border/60">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th className="px-4 py-3">Key</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {keys.map((key) => (
                <tr key={key.id} className="align-top">
                  <td className="px-4 py-4 font-mono text-sm text-foreground">
                    {key.code}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <TestingBadge testing={key.testing} />
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {formatDateTime(key.created_at)}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {formatDateTime(key.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
