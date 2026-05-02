import Link from "next/link"
import { Card, CardContent } from "@workspace/ui/components/card"
import { NAV_PRIMARY_LINKS } from "@/components/NavBar/NavConfig"

type DonationUsageItem = {
  title: string
  body: string
}

type BoardMember = {
  name: string
  role?: string
  githubUrl?: string
  emailUrl?: string
}

type DivisionDirector = {
  startYear: string
  endYear: string | null
  name: string
}

const donationUsageItems: DonationUsageItem[] = [
  {
    title: "Infrastructure",
    body:
      "Donations help cover the hosting, storage, CI/CD, and day-to-day systems that keep VATUSA services available and reliable for the community.",
  },
  {
    title: "Development and Maintenance",
    body:
      "Support also helps sustain the technical work required to build, maintain, and improve VATUSA platforms, integrations, and long-term operational tooling.",
  },
  {
    title: "Training and Education",
    body:
      "We use funding to support educational resources, training platforms, documentation, and initiatives that help members learn and use VATUSA systems effectively.",
  },
  {
    title: "Operational Costs",
    body:
      "As a nonprofit, VATUSA also incurs compliance, filing, accounting, and administrative costs. We work to keep these costs low so more support goes directly toward the mission.",
  },
]

const boardMembers: BoardMember[] = [
  {
    name: "Brandon Barrett",
    role: "VATUSA1 - Division Director",
  },
  {
    name: "Brandon Wening",
    role: "VATUSA2 - Deputy Director Air Traffic Services",
  },
  {
    name: "Brin Brody",
    role: "VATUSA3 - Deputy Director Training Services",
  },
  {
    name: "Jared West",
    role: "VATUSA4 - Deputy Director Support Services",
  },
]

const divisionDirectors: DivisionDirector[] = [
  { startYear: "2001", endYear: "2002", name: "Michael Cunningham" },
  { startYear: "2002", endYear: "2003", name: "Benjamin Schwartz" },
  { startYear: "2003", endYear: "2005", name: "Dane Penington" },
  { startYear: "2005", endYear: "2006", name: "Jeff Turner" },
  { startYear: "2006", endYear: "2007", name: "Dennis Whitley" },
  { startYear: "2007", endYear: "2013", name: "Gary Millsaps" },
  { startYear: "2013", endYear: "2018", name: "Don Desfosse" },
  { startYear: "2018", endYear: "2020", name: "Mark Hubbert" },
  { startYear: "2020", endYear: "2022", name: "Manuel Manigault" },
  { startYear: "2022", endYear: "2022", name: "Anthony Santanastaso" },
  { startYear: "2023", endYear: null, name: "Brandon Barrett" },
]

function formatYearsOfService({
  startYear,
  endYear,
}: Pick<DivisionDirector, "startYear" | "endYear">) {
  return `${startYear} - ${endYear ?? "Present"}`
}

function ctaClassName() {
  return "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
}

export default function FoundationPageContent() {
  return (
    <main className="container mx-auto max-w-5xl py-6">
      <section className="rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/30 p-8 shadow-sm sm:p-10">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            VATUSA Foundation
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Supporting VATUSA&apos;s Mission
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              VATUSA operates as a U.S. 501(c)(3) public charity to support the
              development, operation, education, and long-term stewardship of
              VATUSA services and programs.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={NAV_PRIMARY_LINKS.donate.href} className={ctaClassName()}>
              Donate
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-10">
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Mission</h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Our mission is to promote, protect, and advance VATUSA&apos;s
              educational and operational work. We support the continued
              maintenance and development of VATUSA web services, training
              infrastructure, and community systems; educate the public and the
              VATUSA community in their use; and improve the tools and programs
              that help the division serve its members effectively.
            </p>
          </div>
          <Card className="ring-1 ring-border/60">
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                <span className="font-semibold text-foreground">In short:</span>{" "}
                we exist to support VATUSA&apos;s services, community, and
                training mission.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="ring-1 ring-border/60">
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Donate</h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  VATUSA services may be free to members, but the infrastructure
                  and nonprofit work behind them are not. If you believe in the
                  mission and want to help sustain the division&apos;s tools,
                  training, and operations, please consider donating.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3">
                <Link href={NAV_PRIMARY_LINKS.donate.href} className={ctaClassName()}>
                  Donate to VATUSA
                </Link>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Donations from the United States may be tax-deductible based
                  on the donor&apos;s individual circumstances.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="ring-1 ring-border/60">
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  We Are a 501(c)(3) Public Charity
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  VATUSA proudly holds federal 501(c)(3) public charity status.
                  This status exempts the organization from federal income tax
                  and may allow U.S. donors to deduct eligible donations on
                  their federal tax filings.
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                It also comes with stronger governance and accountability
                requirements that help protect the mission, reinforce public
                trust, and ensure that support is used in service of the
                community rather than private profit.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              How Donations Are Used
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Beating back maintenance debt, keeping services online, and
              supporting educational programs all require sustained investment.
              Foundation support is directed toward the areas that keep VATUSA
              effective and durable over time.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {donationUsageItems.map((item) => (
              <Card key={item.title} className="ring-1 ring-border/60">
                <CardContent className="space-y-2 pt-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Leadership
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              The VATUSA Foundation is governed by a Board of Directors that is
              responsible for oversight, stewardship, and mission alignment.
            </p>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              The current leadership roster and contact links are listed below.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {boardMembers.map((member) => (
              <Card key={member.name} className="ring-1 ring-border/60">
                <CardContent className="space-y-3 pt-6">
                  <div>
                    {member.role ? (
                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    ) : null}
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>
                  </div>
                  <div className="flex gap-4 text-sm">
                    {member.githubUrl ? (
                      <Link
                        href={member.githubUrl}
                        className="text-foreground underline underline-offset-4"
                      >
                        GitHub
                      </Link>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Past VATUSA Division Directors
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This historical list recognizes prior division leadership and
              their years of service.
            </p>
          </div>
          <Card className="ring-1 ring-border/60">
            <CardContent className="px-0 pt-0">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/40">
                      <th
                        scope="col"
                        className="px-6 py-4 text-sm font-semibold text-foreground"
                      >
                        Years of Service
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-sm font-semibold text-foreground"
                      >
                        Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {divisionDirectors.map((director) => (
                      <tr key={`${director.startYear}-${director.name}`}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                          {formatYearsOfService(director)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {director.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
