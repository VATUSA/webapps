import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export type AceTeamMember = {
  id: string
  name: string
  cid: number
  rating: string
  homeFacility: string
}

type AceTeamListProps = {
  members: AceTeamMember[]
}

export default function AceTeamList({ members }: AceTeamListProps) {
  return (
    <Card className="border-border/60 bg-card/95">
      <CardHeader>
        <CardTitle>ACE Team Roster</CardTitle>
      </CardHeader>

      <CardContent>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No ACE team members available.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border/60">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-[1.6fr_1fr_1fr_1.4fr] border-b border-border/60 bg-muted/30 px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <span>Name</span>
                <span>CID</span>
                <span>Rating</span>
                <span>Home Facility</span>
              </div>

              <ul className="divide-y divide-border/60">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="grid grid-cols-[1.6fr_1fr_1fr_1.4fr] px-4 py-3 transition-colors hover:bg-accent/50"
                  >
                    <span className="font-medium text-foreground">
                      {member.name}
                    </span>
                    <span className="text-muted-foreground">{member.cid}</span>
                    <span className="text-muted-foreground">
                      {member.homeFacility}
                    </span>
                    <span className="text-muted-foreground">
                      {member.rating}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
