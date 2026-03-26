import SoloList, { type SoloMember } from "@/components/Solo/SoloList"

const mockSoloMembers: SoloMember[] = [
  {
    id: "solo-1",
    cid: 1155655,
    name: "Robert Shearman Jr",
    rating: "ADM",
    position: "Center (ZDC_CTR)",
    validThrough: "2026-12-31",
  },
  {
    id: "solo-2",
    cid: 1652726,
    name: "Carson Berget",
    rating: "SUP",
    position: "Approach (IAD_APP)",
    validThrough: "2026-10-15",
  },
  {
    id: "solo-3",
    cid: 1340265,
    name: "Junzhe Yan",
    rating: "SUP",
    position: "Tower (DCA_TWR)",
    validThrough: "2026-09-30",
  },
  {
    id: "solo-4",
    cid: 1471203,
    name: "Jackson Smith",
    rating: "I3",
    position: "Center (ZTL_CTR)",
    validThrough: "2027-01-20",
  },
  {
    id: "solo-5",
    cid: 100002,
    name: "Maria Garcia",
    rating: "C1",
    position: "Approach (ATL_APP)",
    validThrough: "2026-11-08",
  },
]


export default function Page() {
  return (
    <main className="container mx-auto py-6">
      <div className="mb-6 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Active Solo Endorsements</h1>

        <div className="rounded-xl bg-chart-2/60 p-6 shadow-sm dark:bg-chart-2/40">
          <h2 className="text-xl font-semibold text-foreground">
            What are Solo Endorsements?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Solo Endorsements allow for a controller of an ARTCC to log onto the network on a position
            they are not yet fully endorsed for. This allows for controllers to gain more practical experience
            outside of thier regular training. This list contains all active endorsements with in the VATUSA Division.
          </p>
        </div>
      </div>
      <SoloList members={mockSoloMembers} />
    </main>
  )
}
