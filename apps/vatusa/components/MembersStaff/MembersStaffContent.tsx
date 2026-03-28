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
    name: "Alex Carter",
    email: "vatusa1@vatusa.net",
  },
  {
    id: "vatusa2",
    position: "VATUSA2 - Deputy Division Director",
    name: "Jordan Lee",
    email: "vatusa1@vatusa.net",
  },
  {
    id: "vatusa3",
    position: "VATUSA3 - Air Traffic Services Director",
    name: "Sam Nguyen",
    email: "vatusa1@vatusa.net",
  },
  {
    id: "vatusa4",
    position: "VATUSA4 - Training Director",
    name: "Taylor Rivera",
    email: "vatusa1@vatusa.net",
  },
  {
    id: "vatusa5",
    position: "VATUSA5 - Events Director",
    name: "Morgan Hill",
    email: "vatusa1@vatusa.net",
  },
  {
    id: "vatusa6",
    position: "VATUSA6 - Web Services Director",
    name: "Casey Brooks",
    email: "vatusa1@vatusa.net",
  },
  {
    id: "vatusa7",
    position: "VATUSA7 - Marketing Director",
    name: "Jamie Patel",
    email: "vatusa1@vatusa.net",
  },
  {
    id: "vatusa8",
    position: "VATUSA8 - Community Director",
    name: "Riley Flores",
    email: "vatusa1@vatusa.net",
  },
  {
    id: "vatusa9",
    position: "VATUSA9 - Conflict Resolution Director",
    name: "Avery Kim",
    email: "vatusa1@vatusa.net",
  },
]

const mockFacilityRosters: FacilityRoster[] = [
  {
    id: "zdc",
    facility: "Washington, D.C. ARTCC",
    staff: [
      {
        id: "zdc-atm",
        position: "Air Traffic Manager (ATM)",
        name: "Justin McElvaney",
        email: "atm@zdcartcc.org",
      },
      {
        id: "zdc-datm",
        position: "Deputy Air Traffic Manager (DATM)",
        name: "Junzhe Yan",
        email: "datm@zdcartcc.org",
      },
      {
        id: "zdc-ta",
        position: "Training Administrator (TA)",
        name: "Jackson Smith",
        email: "ta@zdcartcc.org",
      },
    ],
    members: [
      {
        id: "zdc-1155655",
        name: "Robert Shearman Jr",
        cid: 1155655,
        facility: "ZDC",
      },
      {
        id: "zdc-1652726",
        name: "Carson Berget",
        cid: 1652726,
        facility: "ZDC",
      },
      { id: "zdc-1340265", name: "Junzhe Yan", cid: 1340265, facility: "ZDC" },
      {
        id: "zdc-1471203",
        name: "Jackson Smith",
        cid: 1471203,
        facility: "ZDC",
      },
    ],
  },
  {
    id: "zab",
    facility: "Albuquerque ARTCC",
    staff: [
      {
        id: "zab-atm",
        position: "Air Traffic Manager (ATM)",
        name: "Mia Turner",
        email: "atm@zabartcc.org",
      },
      {
        id: "zab-ta",
        position: "Training Administrator (TA)",
        name: "Ethan Ross",
        email: "ta@zabartcc.org",
      },
    ],
    members: [
      { id: "zab-100001", name: "John Smith", cid: 100001, facility: "ZAB" },
      { id: "zab-100005", name: "Emma Davis", cid: 100005, facility: "ZAB" },
    ],
  },
  {
    id: "ztl",
    facility: "Atlanta ARTCC",
    staff: [
      {
        id: "ztl-atm",
        position: "Air Traffic Manager (ATM)",
        name: "Noah Ellis",
        email: "atm@ztlartcc.org",
      },
      {
        id: "ztl-fe",
        position: "Facility Engineer (FE)",
        name: "Ava Brooks",
        email: "fe@ztlartcc.org",
      },
    ],
    members: [
      { id: "ztl-100002", name: "Maria Garcia", cid: 100002, facility: "ZTL" },
      { id: "ztl-100009", name: "Lucas Hall", cid: 100009, facility: "ZTL" },
    ],
  },
]

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
