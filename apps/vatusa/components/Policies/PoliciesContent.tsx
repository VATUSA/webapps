"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import PoliciesListTab from "@/components/Policies/PoliciesListTab"

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
        summary: "Official VATUSA branding and logo usage guidelines.",
        href: "/downloads/policies/branding-guidelines.pdf",
      },
      {
        id: "media-2",
        title: "Media Kit",
        summary: "Complete media kit with assets and templates.",
        href: "/downloads/policies/media-kit.pdf",
      },
    ],
  },
}

export default function PoliciesContent() {
  const [activeTab, setActiveTab] =
    React.useState<keyof typeof tabConfig>("general-division")

  const tabs = Object.entries(tabConfig)

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

      {/* Tab Navigation */}
      <div className="mb-6 inline-flex rounded-lg border border-border/60 bg-muted/40 p-1">
        {tabs.map(([key, config]) => (
          <Button
            key={key}
            type="button"
            variant={activeTab === key ? "default" : "ghost"}
            className={cn(
              "rounded-md",
              activeTab !== key && "text-muted-foreground"
            )}
            onClick={() => setActiveTab(key as keyof typeof tabConfig)}
            aria-pressed={activeTab === key}
          >
            {config.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <PoliciesListTab
        cardTitle={tabConfig[activeTab].cardTitle}
        items={tabConfig[activeTab].items}
        emptyText={tabConfig[activeTab].emptyText}
      />
    </main>
  )
}
