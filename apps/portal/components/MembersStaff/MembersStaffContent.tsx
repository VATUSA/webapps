// components/MembersStaff/MembersStaffContent.tsx
"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import StaffList from "@/components/MembersStaff/StaffList"
import MembersSearch from "@/components/MembersStaff/MembersSearch"
import { DIVISION_STAFF } from "@/components/MembersStaff/divisionStaff"

type ActiveTab = "staff" | "members"

export default function MembersStaffContent() {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("staff")

  return (
    <main className="container mx-auto py-6">
      <div className="mb-5">
        <h1 className="text-3xl font-semibold tracking-tight">
          Members & Staff
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse current VATUSA staff positions or search members.
        </p>
      </div>

      {/* Tab controls (logic + styling kept in page, per request) */}
      <div className="mb-5 inline-flex rounded-lg border border-border/60 bg-muted/40 p-1">
        <Button
          type="button"
          variant={activeTab === "staff" ? "default" : "ghost"}
          className={cn(
            "rounded-md",
            activeTab !== "staff" && "text-muted-foreground"
          )}
          onClick={() => setActiveTab("staff")}
          aria-pressed={activeTab === "staff"}
        >
          Staff List
        </Button>
        <Button
          type="button"
          variant={activeTab === "members" ? "default" : "ghost"}
          className={cn(
            "rounded-md",
            activeTab !== "members" && "text-muted-foreground"
          )}
          onClick={() => setActiveTab("members")}
          aria-pressed={activeTab === "members"}
        >
          Members Search
        </Button>
      </div>

      {activeTab === "staff" ? (
        <StaffList entries={DIVISION_STAFF} />
      ) : (
        <MembersSearch />
      )}
    </main>
  )
}
