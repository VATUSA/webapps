import Link from "next/link"
import type { CobaltPolicyCategory } from "@workspace/third-party/cobalt"
import { Card, CardContent } from "@workspace/ui/components/card"
import DeletePolicyCategoryButton from "@/components/Policies/DeletePolicyCategoryButton"
import { deletePolicyCategoryAction } from "@/actions/policies"

type CategoriesIndexProps = {
  categories: CobaltPolicyCategory[]
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Link
          href="/facility/zhq/policies/categories/new"
          className="inline-flex h-9 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          New Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No categories found.
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/60">
                <thead className="bg-muted/40">
                  <tr className="text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Sort order</th>
                    <th className="px-4 py-3">Documents</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {categories.map((category) => {
                    const documentCount = category.documents.length
                    const canDelete = documentCount === 0

                    return (
                      <tr key={category.id} className="align-top">
                        <td className="px-4 py-4 font-medium text-foreground">
                          {category.title}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {category.sort_order}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {documentCount}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/facility/zhq/policies/categories/${category.id}/edit`}
                              className="inline-flex h-8 items-center justify-center rounded-md border border-border/60 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                            >
                              Edit
                            </Link>
                            <form
                              action={deletePolicyCategoryAction}
                              className="inline-flex"
                            >
                              <input
                                type="hidden"
                                name="categoryId"
                                value={String(category.id)}
                              />
                              <input
                                type="hidden"
                                name="returnTo"
                                value="/facility/zhq/policies/categories"
                              />
                              <DeletePolicyCategoryButton
                                itemTitle={category.title}
                                disabled={!canDelete}
                                disabledReason={
                                  canDelete
                                    ? undefined
                                    : `Move or delete the ${documentCount} document${
                                        documentCount === 1 ? "" : "s"
                                      } in this category first.`
                                }
                              />
                            </form>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
