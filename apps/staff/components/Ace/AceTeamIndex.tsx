import type { CobaltAceTeamMember } from "@workspace/third-party/cobalt"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import AddAceMemberForm from "@/components/Ace/AddAceMemberForm"
import DeleteAceMemberButton from "@/components/Ace/DeleteAceMemberButton"
import { removeAceTeamMemberAction } from "@/actions/ace"

type AceTeamIndexProps = {
  members: CobaltAceTeamMember[]
  canManageAceTeam?: boolean
}

export default function AceTeamIndex({
  members,
  canManageAceTeam,
}: AceTeamIndexProps) {
  return (
    <Card className="border-border/60 bg-card/95">
      <CardHeader>
        <CardTitle>ACE Team Roster</CardTitle>
      </CardHeader>

      {canManageAceTeam ? (
        <CardContent className="pb-0">
          <AddAceMemberForm existingCids={members.map((m) => m.cid)} />
        </CardContent>
      ) : null}

      <CardContent>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No ACE team members available.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border/60">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-[1.6fr_1fr_1.4fr_auto] border-b border-border/60 bg-muted/30 px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <span>Name</span>
                <span>CID</span>
                <span>Rating</span>
                <span className="text-right">Actions</span>
              </div>

              <ul className="divide-y divide-border/60">
                {members.map((member) => (
                  <li
                    key={member.cid}
                    className="grid grid-cols-[1.6fr_1fr_1.4fr_auto] items-center px-4 py-3 transition-colors hover:bg-accent/50"
                  >
                    <span className="font-medium text-foreground">
                      {member.name}
                    </span>
                    <span className="text-muted-foreground">{member.cid}</span>
                    <span className="text-muted-foreground">
                      {member.rating_short}
                    </span>
                    <span className="text-right">
                      {canManageAceTeam ? (
                        <form
                          action={removeAceTeamMemberAction}
                          className="inline-flex"
                        >
                          <input
                            type="hidden"
                            name="cid"
                            value={String(member.cid)}
                          />
                          <DeleteAceMemberButton memberName={member.name} />
                        </form>
                      ) : null}
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
