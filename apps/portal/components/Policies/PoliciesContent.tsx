"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import type { CobaltPolicyCategory } from "@workspace/third-party/cobalt"
import PoliciesListTab, {
  type PolicyListItem,
} from "@/components/Policies/PoliciesListTab"

type PoliciesContentProps = {
  categories: CobaltPolicyCategory[]
  loadFailed: boolean
}

function toListItems(category: CobaltPolicyCategory): PolicyListItem[] {
  return category.documents.map((document) => ({
    id: document.ident,
    title: document.title,
    summary: document.summary,
    href: document.document_url,
    effectiveDate: document.effective_date,
  }))
}

export default function PoliciesContent({
  categories,
  loadFailed,
}: PoliciesContentProps) {
  const [activeTab, setActiveTab] = React.useState(categories[0]?.id)

  const activeCategory = categories.find((c) => c.id === activeTab) ?? categories[0]

  return (
    <main className="container mx-auto max-w-4xl py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Policies & Documents
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse VATUSA policies, guidelines, and official documents.
        </p>
      </div>

      {loadFailed ? (
        <Card className="mb-6 border-destructive/40 bg-destructive/5">
          <CardContent className="py-4 text-sm text-destructive">
            We couldn&apos;t load policies right now. Please try again
            shortly.
          </CardContent>
        </Card>
      ) : null}

      {categories.length === 0 ? (
        loadFailed ? null : (
          <Card className="border-border/60 bg-card/95">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No policy documents are available right now.
            </CardContent>
          </Card>
        )
      ) : (
        <>
          {categories.length > 1 ? (
            <div className="mb-6 inline-flex flex-wrap rounded-lg border border-border/60 bg-muted/40 p-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  variant={activeCategory?.id === category.id ? "default" : "ghost"}
                  className={cn(
                    "rounded-md",
                    activeCategory?.id !== category.id &&
                      "text-muted-foreground"
                  )}
                  onClick={() => setActiveTab(category.id)}
                  aria-pressed={activeCategory?.id === category.id}
                >
                  {category.title}
                </Button>
              ))}
            </div>
          ) : null}

          {activeCategory ? (
            <PoliciesListTab
              cardTitle={activeCategory.title}
              items={toListItems(activeCategory)}
              emptyText="No policy documents available."
            />
          ) : null}
        </>
      )}
    </main>
  )
}
