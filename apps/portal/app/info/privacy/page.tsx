"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const LAST_UPDATED = "October 2, 2026"

const DPO_EMAIL = "dpo@vatusa.net"

const sections = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "information-usage", label: "Information Usage" },
  { id: "who-we-share-with", label: "Who We Share With" },
  { id: "international-transfers", label: "International Transfers" },
  { id: "data-retention", label: "Data Retention" },
  { id: "cookie-usage", label: "Cookie Usage" },
  { id: "your-rights", label: "Your Privacy Rights (GDPR)" },
  { id: "controller-dpo", label: "Data Controller & DPO" },
  { id: "opt-out", label: "Opt Out & Deletion" },
] as const

type SectionId = (typeof sections)[number]["id"]

const defaultSection: SectionId = "information-we-collect"

const linkClassName =
  "font-medium text-primary underline-offset-4 hover:underline"

function isSectionId(value: string): value is SectionId {
  return sections.some((section) => section.id === value)
}

function useHashSection() {
  const [activeSection, setActiveSection] =
    React.useState<SectionId>(defaultSection)

  React.useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash.replace(/^#/, "")
      if (isSectionId(raw)) {
        setActiveSection(raw)
      }
    }

    applyHash()
    window.addEventListener("hashchange", applyHash)
    return () => window.removeEventListener("hashchange", applyHash)
  }, [])

  const selectSection = (id: SectionId) => {
    setActiveSection(id)
    window.history.replaceState(null, "", `#${id}`)
  }

  return { activeSection, selectSection }
}

function DpoEmailLink() {
  return (
    <a href={`mailto:${DPO_EMAIL}`} className={linkClassName}>
      {DPO_EMAIL}
    </a>
  )
}

function SectionLink({ id, children }: { id: SectionId; children: string }) {
  return (
    <a href={`#${id}`} className={linkClassName}>
      {children}
    </a>
  )
}

function PrivacySectionContent({ section }: { section: SectionId }) {
  if (section === "information-we-collect") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          To provide VATUSA services, we collect information in the following
          ways:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">
              Information from you and VATSIM.
            </span>{" "}
            When you register an account with VATSIM and join or transfer to
            VATUSA, log in to a VATUSA service, take an exam, or use the VATUSA
            Academy, information that is generally considered personal is given
            to us by you and by VATSIM (through VATSIM Connect). This includes,
            but is not limited to: your VATSIM CERT Identification Number (CID),
            name, email address, ratings, and region and division assignment.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Training and membership records.
            </span>{" "}
            As you take part in the division, we record your facility
            assignments, transfers and visits, training sessions and
            evaluations, exam results, certifications, rating changes, and
            actions taken on your account by VATUSA and facility staff.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Linked accounts.
            </span>{" "}
            If you choose to link your Discord account, we store your Discord
            user ID so that roles can be assigned to you on VATUSA Discord
            servers.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Information from your device.
            </span>{" "}
            Some information is passed by your computer or electronic device and
            web browser, including your IP address, web browser type and
            version, and operating system. This information may be linked to
            your account.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Log Information.
            </span>{" "}
            When you use VATUSA services, requests are logged. Information
            logged can include: the page or resource requested, the time of the
            request, the IP address the request originated from, the software
            used to make the request, and the result of the request.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Location Information.
            </span>{" "}
            Your approximate location may be derived from your IP address, or
            from information given to us by you or by VATSIM.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Storage Location.
            </span>{" "}
            Data is stored and encrypted on services owned or leased by VATUSA
            within the United States.
          </li>
        </ul>
        <p>
          We do not use third-party analytics or advertising services, and we do
          not sell your information.
        </p>
      </div>
    )
  }

  if (section === "information-usage") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          We use the information collected to provide, maintain, protect, and
          improve our services. Each use has a legal basis under the EU and UK
          General Data Protection Regulation (GDPR):
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">
              Operating the division
            </span>{" "}
            (legitimate interests): maintaining the membership roster, facility
            assignments, transfers and visits, training, exams, certifications,
            and ratings, and enabling VATUSA facilities to do the same.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Security and abuse prevention
            </span>{" "}
            (legitimate interests): keeping logs and IP addresses to detect,
            investigate, and prevent misuse of our services and of the VATSIM
            network.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Communicating with you
            </span>{" "}
            (legitimate interests): sending emails about your membership,
            training, transfers, and requests you make.
          </li>
          <li>
            <span className="font-medium text-foreground">Legal requests</span>{" "}
            (legal obligation): responding to valid requests from law
            enforcement or other authorities.
          </li>
        </ul>
        <p>
          Where we rely on legitimate interests, you have the right to object;
          see <SectionLink id="your-rights">Your Privacy Rights</SectionLink>.
          We do not make decisions about you based solely on automated
          processing that have legal or similarly significant effects.
        </p>

        <p>
          The information we collect is maintained with confidentiality to the
          extent possible. The following information is shared with VATUSA
          associated facilities:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>VATSIM CERT Identification Number (CID)</li>
          <li>Your name</li>
          <li>Your VATSIM achievements and ratings</li>
          <li>Your VATSIM-associated email address</li>
          <li>
            VATUSA facility associations, VATSIM region and division
            associations
          </li>
          <li>Your VATUSA training and certification records</li>
          <li>VATUSA staff associations and VATUSA staff email addresses</li>
        </ul>

        <p>The following information may be shared publicly:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>VATSIM CERT Identification Number (CID)</li>
          <li>Your name</li>
          <li>VATUSA staff associations and VATUSA staff email addresses</li>
          <li>
            VATUSA facility associations, VATSIM region and division
            associations
          </li>
          <li>VATSIM achievements and ratings</li>
        </ul>

        <p>
          The following information is collected and may be used to protect our
          services, up to and including cooperation with legal requests for
          information from Law Enforcement agencies:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>The above listed public information</li>
          <li>IP addresses used and associated with your account</li>
          <li>Geolocation against aforementioned IP addresses</li>
          <li>Activities performed with the VATUSA web services</li>
        </ul>

        <p>
          We may store identification tokens and other limited information on
          your electronic device through web storage or cookie usage.
        </p>
      </div>
    )
  }

  if (section === "who-we-share-with") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          The information we collect may be shared, in limited capacities, with
          the following:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Virtual Air Traffic Simulation Network (www.vatsim.net)</li>
          <li>
            VATUSA associated facilities (listed under &quot;Facilities&quot; on
            the navigation bar at www.vatusa.net)
          </li>
          <li>Law Enforcement agencies</li>
        </ul>
        <p>
          We also use service providers that process information on our behalf
          and only to provide their service to us:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Cloudflare (content delivery and security)</li>
          <li>DigitalOcean and Microsoft Azure (hosting and data storage)</li>
          <li>Google Workspace (VATUSA staff email accounts)</li>
          <li>Our email delivery provider (sending emails to you)</li>
          <li>Discord (only if you link your Discord account)</li>
        </ul>
        <p>
          For more information on what is shared with whom, please see{" "}
          <SectionLink id="information-usage">Information Usage</SectionLink>.
        </p>
      </div>
    )
  }

  if (section === "international-transfers") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          VATUSA services and data are hosted in the United States. If you use
          VATUSA services from outside the United States, including from the
          European Economic Area (EEA), the United Kingdom, or Switzerland, your
          information is transferred to and processed in the United States.
        </p>
        <p>
          This transfer is necessary to provide the services you request from
          us. Where our service providers process personal data from the EEA or
          the UK, they do so under the EU-U.S. Data Privacy Framework (and its
          UK extension) or the European Commission&apos;s Standard Contractual
          Clauses.
        </p>
      </div>
    )
  }

  if (section === "data-retention") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          We keep your VATUSA account information, including your profile,
          facility and roster history, training records, certifications, rating
          history, and the record of actions taken on your account, for as long
          as you hold a VATSIM account associated with VATUSA, and afterward
          until you ask us to delete it. These records support transfers,
          visiting, and returning members, and let facilities verify past
          training and certifications.
        </p>
        <p>
          Server access logs, which include IP addresses and browser
          information, are kept with full IP addresses for 90 days. After that,
          IP addresses are truncated so they no longer identify an individual
          device, and the remaining logs are kept for service statistics.
        </p>
        <p>Database backups are kept for 7 days on a rolling basis.</p>
        <p>
          <span className="font-medium text-foreground">
            Deletion requests.
          </span>{" "}
          You can ask us to delete your data at any time by contacting our Data
          Protection Officer at <DpoEmailLink />. We will complete your request
          within 30 days. This removes your account and roster record, training
          and certification records, and your records on the VATUSA Academy.
          Copies in our backups expire within 7 days after that. A minimal
          record of administrative actions taken on your account, such as rating
          changes, is kept for the integrity of the division&apos;s records; it
          is identified only by your CID.
        </p>
      </div>
    )
  }

  if (section === "cookie-usage") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          We use cookies and similar technologies, such as web storage, only
          where they are necessary to provide VATUSA services: to keep you
          logged in, to perform authentication and authorization checks for
          restricted areas, and to remember basic preferences. Our content
          delivery provider, Cloudflare, may also set cookies needed to protect
          our services from abuse.
        </p>
        <p>We do not use analytics, advertising, or tracking cookies.</p>
        <p>
          You may choose to disable cookie usage via your browser, but know that
          doing so will prevent you from logging in and using restricted areas
          of the website.
        </p>
      </div>
    )
  }

  if (section === "your-rights") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          Under the EU and UK General Data Protection Regulation (GDPR), you
          have the following rights over your personal data. VATUSA honors these
          requests regardless of where you live.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Access.</span> Ask for
            a copy of the personal data we hold about you.
          </li>
          <li>
            <span className="font-medium text-foreground">Rectification.</span>{" "}
            Ask us to correct inaccurate or incomplete data. Data that comes
            from VATSIM, such as your name and email address, must be corrected
            with VATSIM, and will update with us the next time you log in.
          </li>
          <li>
            <span className="font-medium text-foreground">Erasure.</span> Ask us
            to delete your personal data. See{" "}
            <SectionLink id="data-retention">Data Retention</SectionLink> for
            what is removed.
          </li>
          <li>
            <span className="font-medium text-foreground">Restriction.</span>{" "}
            Ask us to limit how we use your data, for example while a correction
            is being reviewed.
          </li>
          <li>
            <span className="font-medium text-foreground">Objection.</span>{" "}
            Object to processing we carry out based on our legitimate interests.
          </li>
          <li>
            <span className="font-medium text-foreground">Portability.</span>{" "}
            Receive data you provided to us in a structured, commonly used,
            machine-readable format.
          </li>
          <li>
            <span className="font-medium text-foreground">Complaint.</span>{" "}
            Lodge a complaint with a data protection supervisory authority,
            particularly in the country where you live or work. In the UK, this
            is the Information Commissioner&apos;s Office (ICO).
          </li>
        </ul>
        <p>
          <span className="font-medium text-foreground">
            How to make a request.
          </span>{" "}
          Email our Data Protection Officer at <DpoEmailLink /> from the email
          address associated with your VATSIM account, and include your CID. We
          may ask you to verify your identity before acting on a request. There
          is no charge, and we will respond within 30 days.
        </p>
      </div>
    )
  }

  if (section === "controller-dpo") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          VATUSA, the United States Division of the Virtual Air Traffic
          Simulation Network (VATSIM), is the data controller for personal data
          processed through VATUSA services.
        </p>
        <p>
          VATUSA has designated a Data Protection Officer (DPO), who is
          responsible for overseeing how VATUSA handles personal data and for
          handling privacy questions and requests. You can contact the DPO at{" "}
          <DpoEmailLink />.
        </p>
        <p>
          VATSIM is a separate data controller for your VATSIM account. For
          questions about data held by VATSIM, please refer to VATSIM&apos;s
          privacy policy at{" "}
          <a
            href="https://vatsim.net/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            https://vatsim.net/
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
      <p>
        Given the nature of our services, it is not possible to opt out of data
        collection and still use our services. If you no longer wish to use our
        services, you can ask us to delete the information we have collected
        about you by emailing our Data Protection Officer at <DpoEmailLink />.
        See <SectionLink id="data-retention">Data Retention</SectionLink> for
        what is removed and how long it takes.
      </p>
      <p>
        Deleting your data from VATUSA does not delete your VATSIM account. To
        deactivate your VATSIM account and request that VATSIM purge your data,
        please head to:
      </p>
      <p>
        <a
          href="https://membership.vatsim.net/"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          https://membership.vatsim.net/
        </a>
      </p>
      <p>
        Deletion requests that VATSIM forwards to VATUSA are processed the same
        way as requests made directly to us.
      </p>
      <p>
        Note: VATUSA cannot guarantee that information collected by parties
        outside of VATUSA, such as independently operated facility websites,
        will be purged in the process.
      </p>
      <p>
        If you need help, visit{" "}
        <Link href="/support/faq" className={linkClassName}>
          Support / FAQ
        </Link>
        .
      </p>
    </div>
  )
}

export default function PrivacyPolicyPage() {
  const { activeSection, selectSection } = useHashSection()

  const activeLabel =
    sections.find((section) => section.id === activeSection)?.label ??
    "Privacy Policy"

  return (
    <main className="container mx-auto max-w-6xl py-6">
      <section className="mb-6 rounded-xl border border-border/60 bg-card/95 p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Legal
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          VATUSA Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          When you use VATUSA services, there is information sent to us that we
          use to collect statistics, analyze trends, and provide services to you
          and the facilities that make up VATUSA.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[270px_1fr]">
        <Card className="h-fit border-border/60 bg-card/95 lg:sticky lg:top-24">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Policy Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              role="tablist"
              aria-label="Privacy policy sections"
              className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible"
            >
              {sections.map((section) => {
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${section.id}`}
                    onClick={() => selectSection(section.id)}
                    className={cn(
                      "rounded-md border px-3 py-2 text-left text-sm font-medium whitespace-nowrap transition-colors",
                      isActive
                        ? "border-primary/60 bg-primary/15 text-foreground dark:bg-primary/25"
                        : "border-border/60 bg-background/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {section.label}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/95">
          <CardHeader>
            <CardTitle>{activeLabel}</CardTitle>
          </CardHeader>
          <CardContent
            id={`panel-${activeSection}`}
            role="tabpanel"
            aria-label={activeLabel}
          >
            <PrivacySectionContent section={activeSection} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
