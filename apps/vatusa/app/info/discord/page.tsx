import DiscordJoinPage from "@/components/Discord/DiscordJoinPage"

const FALLBACK_DISCORD_INVITE_URL = "https://discord.gg/a7Qcse7"

export default function Page() {
  const inviteUrl =
    process.env.VATUSA_DISCORD_INVITE_URL ?? FALLBACK_DISCORD_INVITE_URL

  return <DiscordJoinPage inviteUrl={inviteUrl} />
}
