import DiscordJoinPage from "@/components/Discord/DiscordJoinPage"
import { Metadata } from "next"

const FALLBACK_DISCORD_INVITE_URL = "https://discord.gg/a7Qcse7"

export const metadata: Metadata = {
  title: "Join Our Discord | VATUSA",
  description: "Connect with the VATUSA community on Discord",
}

export default function Page() {
  const inviteUrl =
    process.env.VATUSA_DISCORD_INVITE_URL ?? FALLBACK_DISCORD_INVITE_URL

  return <DiscordJoinPage inviteUrl={inviteUrl} />
}
