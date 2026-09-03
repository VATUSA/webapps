import Link from "next/link"
import type { CobaltPolicyCategory } from "@workspace/third-party/cobalt"
import { Card, CardContent } from "@workspace/ui/components/card"
import DeletePolicyDocumentButton from "@/components/Policies/DeletePolicyDocumentButton"
import { deletePolicyDocumentAction } from "@/actions/policies"

type PoliciesIndexProps = {
  categories: CobaltPolicyCategory[]
}

function HiddenBadge({ hidden }: { hidden: boolean }) {
  if (!hidden) return <span className="text-muted-foreground">—</span>
  return (
    <span className="inline-flex items-center rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
      Hidden
    </span>
  )
}

export default function PoliciesIndex({ categories }: PoliciesIndexProps) {
  const totalDocuments = categories.reduce(
    (sum, category) => sum + category.documents.length,
    0
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Link
          href="/facility/zhq/policies/new"
          className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          New Document
        </Link>
      </div>

      {totalDocuments === 0 ? (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No policy documents found.
          </CardContent>
        </Card>
      ) : (
        categories.map((category) =>
          category.documents.length === 0 ? null : (
            <Card key={category.id} className="border-border/60">
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                  <h2 className="text-sm font-semibold text-foreground">
                    {category.title}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {category.documents.length} document
                    {category.documents.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border/60">
                    <thead className="bg-muted/40">
                      <tr className="text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        <th className="px-4 py-3">Ident</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Effective</th>
                        <th className="px-4 py-3">Visibility</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {category.documents.map((document) => (
                        <tr key={document.id} className="align-top">
                          <td className="px-4 py-4 font-medium text-foreground">
                            {document.ident}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {document.title}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {document.effective_date}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <HiddenBadge hidden={document.hidden} />
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Link
                                href={`/facility/zhq/policies/${document.id}/edit`}
                                className="inline-flex h-8 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                              >
                                Edit
                              </Link>
                              <form
                                action={deletePolicyDocumentAction}
                                className="inline-flex"
                              >
                                <input
                                  type="hidden"
                                  name="documentId"
                                  value={String(document.id)}
                                />
                                <input
                                  type="hidden"
                                  name="returnTo"
                                  value="/facility/zhq/policies"
                                />
                                <DeletePolicyDocumentButton
                                  itemTitle={document.title}
                                />
                              </form>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )
        )
      )}
    </div>
  )
}
