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
        id: "DP001",
        title: "General Division Policy",
        summary:
          "Provides a standard for the general administration of VATUSA Division.",
        href: "https://vatusa-storage.nyc3.cdn.digitaloceanspaces.com/docs/general-division-policy.pdf",
      },
      {
        id: "DP002",
        title: "General Training Policy",
        summary: "Training Policy",
        href: "https://vatusa-storage.nyc3.cdn.digitaloceanspaces.com/docs/division-training-policy.pdf",
      },
      {
        id: "DP003",
        title: "General Events Policy",
        summary:
          "Establishes division-wide clarification and standardization of event processes and procedures.",
        href: "https://vatusa-storage.nyc3.cdn.digitaloceanspaces.com/docs/general-events-policy.pdf",
      },
      {
        id: "7210.35C",
        title: "VATUSA Air Traffic Control System Command Center",
        summary:
          "Prescribes the organization, functions, procedures, and policies of the VATUSA Air Traffic Control System Command Center.",
        href: "https://vatusa-storage.nyc3.cdn.digitaloceanspaces.com/docs/vatusa-command-center.pdf",
      },
      {
        id: "7210.932",
        title: "NTML Entry Codes",
        summary: "Reference for NTML entry codes.",
        href: "https://vatusa-storage.nyc3.cdn.digitaloceanspaces.com/docs/ntml-entry-codes-reference.pdf",
      },
      {
        id: "GRPFLT",
        title: "Flight Notification and Staffing Request Guide",
        summary:
          "A brief guide on how to submit requests for staffing and group flight notifications for VA/VSO/group flight/streamers.",
        href: "https://vatusa-storage.nyc3.cdn.digitaloceanspaces.com/docs/group-flight-notification-staffing-guide.pdf",
      },
      {
        id: "ORG",
        title: "VATUSA Organizational Chart",
        summary:
          "This graphic defines the staff structure and chain-of-command of VATUSA.",
        href: "https://vatusa-storage.nyc3.cdn.digitaloceanspaces.com/docs/vatusa-organizational-chart.jpeg",
      },
    ],
  },
  media: {
    label: "Media",
    cardTitle: "Media Policies",
    emptyText: "No media policy items available.",
    items: [
      {
        id: "SMT001",
        title: "Social Media Team Standard Operating Procedure",
        summary: "",
        href: "https://vatusa-storage.nyc3.cdn.digitaloceanspaces.com/docs/social-media-team-standard-operating-procedure-.pdf",
      },
      {
        id: "BSG2021.1",
        title: "VATUSA Brand Style Guide",
        summary: "VATUSA Branding & Styling Guidelines v.2021.1",
        href: "https://vatusa-storage.nyc3.cdn.digitaloceanspaces.com/docs/brand-style-guide.pdf",
      },
      {
        id: "PLA2021.1",
        title: "VATUSA Public Logo Assets",
        summary: "VATUSA Public Logo Assets",
        href: "https://vatusa-storage.nyc3.cdn.digitaloceanspaces.com/docs/vatusa-public-logo-assets.zip",
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
