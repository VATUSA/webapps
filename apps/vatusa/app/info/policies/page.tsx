"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import PoliciesListTab, {
  type PolicyListItem,
} from "@/components/Policies/PoliciesListTab"

type TabDefinition = {
  label: string
  cardTitle: string
  emptyText: string
  items: PolicyListItem[]
}

const tabConfig = {
  "general-division": {
    label: "General Division",
    cardTitle: "General Division Policies",
    emptyText: "No policy documents available.",
    items: [
      {
        id: "gd-1",
        title: "VATUSA Code of Conduct",
        summary: "Core behavior and professionalism standards for all members.",
        href: "/downloads/policies/code-of-conduct.pdf",
      },
      {
        id: "gd-2",
        title: "Controller Requirements",
        summary: "Baseline requirements for controller activity and currency.",
        href: "/downloads/policies/controller-requirements.pdf",
      },
      {
        id: "gd-3",
        title: "Visiting & Transfer Policy",
        summary: "Guidance for controller transfers and visitor assignments.",
        href: "/downloads/policies/visiting-transfer.pdf",
      },
    ],
  },
  media: {
    label: "Media",
    cardTitle: "Media Policies",
    emptyText: "No media policy items available.",
    items: [
      {
        id: "media-1",
        title: "Branding Guidelines",
        badge: "PDF",
        summary: "Logo use, color palette, and typography standards.",
        href: "/downloads/media/branding-guidelines.pdf",
      },
      {
        id: "media-2",
        title: "Press Kit",
        badge: "ZIP",
        summary: "Approved logos and media assets for public use.",
        href: "/downloads/media/vatusa-press-kit.zip",
      },
      {
        id: "media-3",
        title: "Social Media Policy",
        badge: "PDF",
        summary: "Posting standards and moderation expectations.",
        href: "/downloads/media/social-media-policy.pdf",
      },
    ],
  },
} as const satisfies Record<string, TabDefinition>

type ActiveTab = keyof typeof tabConfig

const tabKeys = Object.keys(tabConfig) as ActiveTab[]

export default function Page() {
  const [activeTab, setActiveTab] =
    React.useState<ActiveTab>("general-division")
  const activeConfig = tabConfig[activeTab]

  return (
    <main className="container mx-auto py-6">
      <div className="mb-5">
        <h1 className="text-3xl font-semibold tracking-tight">
          Policies & Downloads
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review division policy documents and media standards.
        </p>
      </div>

      <div className="mb-5 inline-flex rounded-lg border border-border/60 bg-muted/40 p-1">
        {tabKeys.map((tabKey) => (
          <Button
            key={tabKey}
            type="button"
            variant={activeTab === tabKey ? "default" : "ghost"}
            className={cn(
              "rounded-md",
              activeTab !== tabKey && "text-muted-foreground"
            )}
            onClick={() => setActiveTab(tabKey)}
            aria-pressed={activeTab === tabKey}
          >
            {tabConfig[tabKey].label}
          </Button>
        ))}
      </div>

      <PoliciesListTab
        cardTitle={activeConfig.cardTitle}
        emptyText={activeConfig.emptyText}
        items={activeConfig.items}
      />
    </main>
  )
}
