import AceTeamList from "@/components/Ace/AceTeamList"
import { fetchAceTeam } from "@/actions/ace"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "ACE Team | VATUSA",
  description: "VATUSA ACE team information and roster",
}

export default async function Page() {
  const members = await fetchAceTeam()

  return (
    <main className="container mx-auto py-6">
      <div className="mb-6 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">ACE Team</h1>

        <div className="rounded-xl bg-chart-2/60 p-6 shadow-sm dark:bg-chart-2/40">
          <h2 className="text-xl font-semibold text-foreground">
            What is the ACE Team?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            The VATUSA Advanced Controller for Events (ACE) Team is a group of
            highly skilled advanced controllers who have volunteered to make
            themselves available for assisting USA Facilities with event
            staffing. Each member represents the best of VATUSA controlling
            ability and are exceptional controllers. Facilities in need of the
            ACE Team should utilize the VATUSA Discord #aceteam-requests channel
            or contact the VATUSA Events Manager (VATUSA5) to schedule the team
            for an event.
          </p>
        </div>
      </div>

      <AceTeamList members={members} />
    </main>
  )
}
