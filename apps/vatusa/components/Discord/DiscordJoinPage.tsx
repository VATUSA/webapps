import Link from "next/link"
import { MessageCircle, ShieldCheck, Users, Radio } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

type DiscordJoinPageProps = {
  inviteUrl: string
}

const highlights = [
  {
    icon: Users,
    title: "Community Channels",
    description:
      "Meet controllers and pilots across every ARTCC, ask questions, and connect quickly.",
  },
  {
    icon: Radio,
    title: "Event Announcements",
    description:
      "Follow upcoming event announcements and event-chat discussions so you always know what is happening next across VATUSA.",
  },
  {
    icon: ShieldCheck,
    title: "Academy Help",
    description:
      "Use our Academy help channels to get training guidance, ask questions, and learn from instructors and experienced members.",
  },
]

export default function DiscordJoinPage({ inviteUrl }: DiscordJoinPageProps) {
  return (
    <main className="relative min-h-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20"
      >
        <div className="absolute top-14 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-8 bottom-12 h-64 w-64 rounded-full bg-chart-2/20 blur-3xl" />
      </div>

      <section className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-border/60 bg-card/95 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6 sm:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5" />
                VATUSA Community
              </div>

              <h1 className="mt-4 bg-linear-to-r from-primary via-primary/80 to-chart-2 bg-clip-text pb-1 text-4xl leading-[1.12] font-extrabold tracking-tight text-transparent sm:text-5xl">
                Join the Official VATUSA Discord
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Join a welcoming VATUSA community where pilots and controllers
                connect, share experiences, and help each other grow.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={inviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  Join Discord
                </Link>

                <Link
                  href="/info/members-staff"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  View Staff
                </Link>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Trouble opening the button? Copy this invite URL:
                <span className="ml-1 font-mono text-foreground">
                  {inviteUrl}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.title}
                className="border-border/60 bg-card/95 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/40"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-4 w-4 text-primary" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}
