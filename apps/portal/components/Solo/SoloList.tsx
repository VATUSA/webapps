import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export type SoloMember = {
  id: string
  name: string
  cid: number
  rating: string
  position: string
  validThrough: string
}

type SoloListProps = {
  members: SoloMember[]
}

export default function SoloList({ members }: SoloListProps) {
  const sortedMembers = [...members].sort((a, b) => {
    const aTime = new Date(a.validThrough).getTime()
    const bTime = new Date(b.validThrough).getTime()

    // Push invalid dates to the bottom.
    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0
    if (Number.isNaN(aTime)) return 1
    if (Number.isNaN(bTime)) return -1

    return aTime - bTime
  })
  return (
    <Card className="border-border/60 bg-card/95">
      <CardHeader>
        <CardTitle>Solo Endorsements</CardTitle>
      </CardHeader>

      <CardContent>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active Solo Endorsements.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border/60">
            <div className="min-w-[880px]">
              <div className="grid grid-cols-[1.8fr_1fr_0.9fr_1.8fr_1.2fr] border-b border-border/60 bg-muted/30 px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <span>Name</span>
                <span>CID</span>
                <span>Rating</span>
                <span>Position</span>
                <span>Valid through</span>
              </div>

              <ul className="divide-y divide-border/60">
                {sortedMembers.map((member) => (
                  <li
                    key={member.id}
                    className="grid grid-cols-[1.8fr_1fr_0.9fr_1.8fr_1.2fr] px-4 py-3 transition-colors hover:bg-accent/50"
                  >
                    <span className="font-medium text-foreground">
                      {member.name}
                    </span>
                    <span className="text-muted-foreground">{member.cid}</span>
                    <span className="text-muted-foreground">
                      {member.rating}
                    </span>
                    <span className="text-muted-foreground">
                      {member.position}
                    </span>
                    <span className="text-muted-foreground">
                      {member.validThrough}
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
