// components/MembersStaff/MembersStaffContent.tsx
"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import StaffList, { type StaffEntry } from "@/components/MembersStaff/StaffList"
import MembersSearch, {
  type FacilityRoster,
} from "@/components/MembersStaff/MembersSearch"

type ActiveTab = "staff" | "members"

// Mock data for now; later replace with API response.
const mockStaff: StaffEntry[] = [
  {
    id: "vatusa1",
    position: "VATUSA1 - Division Director",
    name: "Brandon Barrett",
    email: "vatusa1@vatusa.net",
  },
  {
    id: "vatusa2",
    position: "VATUSA2 - Deputy Director Air Traffic Services",
    name: "Brandon Wening",
    email: "vatusa2@vatusa.net",
  },
  {
    id: "vatusa3",
    position: "VATUSA3 - Deputy Director Training Services",
    name: "Brin Brody",
    email: "vatusa3@vatusa.net",
  },
  {
    id: "vatusa4",
    position: "VATUSA4 - Deputy Director Support Services",
    name: "Jared West",
    email: "vatusa4@vatusa.net",
  },
  {
    id: "vatusa5",
    position: "VATUSA5 - Events Manager",
    name: "Dan Michael Bonaga",
    email: "vatusa5@vatusa.net",
  },
  {
    id: "vatusa6",
    position: "VATUSA6 - Technical Manager",
    name: "Matt Boulanger",
    email: "vatusa6@vatusa.net",
  },
  {
    id: "vatusa7",
    position: "VATUSA7 - Social Media Manager",
    name: "Jason Calder",
    email: "vatusa7@vatusa.net",
  },
  {
    id: "vatusa8",
    position: "VATUSA8 - Training Services Manager",
    name: "Ashar Hussain",
    email: "vatusa8@vatusa.net",
  },
  {
    id: "vatusa9",
    position: "VATUSA9 - Training Content and Curriculum Manager",
    name: "Andrew Selder",
    email: "vatusa9@vatusa.net",
  },
]

const mockFacilityRosters: FacilityRoster[] = []

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
        <StaffList entries={mockStaff} />
      ) : (
        <MembersSearch rosters={mockFacilityRosters} />
      )}
    </main>
  )
}
