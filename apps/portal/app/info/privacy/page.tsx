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

const LAST_UPDATED = "March 27, 2026"

const sections = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "information-usage", label: "Information Usage" },
  { id: "who-we-share-with", label: "Who We Share With" },
  { id: "cookie-usage", label: "Cookie Usage" },
  { id: "opt-out", label: "Opt Out" },
] as const

type SectionId = (typeof sections)[number]["id"]

const defaultSection: SectionId = "information-we-collect"

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

function PrivacySectionContent({ section }: { section: SectionId }) {
  if (section === "information-we-collect") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          To help enhance the VATUSA experience, we collect information across a
          series of products and services all to enhance the user experience. We
          collect information in the following ways:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">
              Information you give us.
            </span>{" "}
            When you register an account with VATSIM and transfer to VATUSA,
            login to the VATUSA service, take a quiz, use our Computer Based
            Training (CBT) system, or participate in the forums, information
            that is generally considered personal is given to us from you and
            VATSIM to include, but is not limited to: your name and email
            address.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Information we get from you.
            </span>{" "}
            Some other information is passed by your computer or electronic
            device, web browser, and VATSIM client. Information can include:
            your IP address, web browser type and version, device-specific
            information (such as operating system, unique device identifiers,
            and mobile network information). This information may be linked to
            your account.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Log Information.
            </span>{" "}
            Each time you perform an action on VATUSA services, your action is
            logged. Information logged can include: type of action, data being
            sent and received, IP address the request originated from, software
            used to make the request, identification cookies, and the results of
            the request.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Location Information.
            </span>{" "}
            Your location information may be associated with each request
            through geolocation against the originating IP address, information
            given to us by you, or given to us by you through VATSIM.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Analytical Information.
            </span>{" "}
            Via Google Analytics, we may collect anonymized statistical
            information to include: age, gender, location, device information,
            web browser type and version, ISPs, mobile network provider
            information, etc. for the purposes of identifying trends and better
            target our platforms.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Storage Location.
            </span>{" "}
            Data is stored and encrypted on services owned or leased by VATUSA
            within the United States.
          </li>
        </ul>
      </div>
    )
  }

  if (section === "information-usage") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          To help enhance the VATUSA experience, we collect information across a
          series of products and services all to enhance the user experience.
        </p>
        <p>
          We use the information collected to provide, maintain, protect, and
          improve our services.
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
          <li>All IP addresses used and associated with your account</li>
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
          <li>Other VATUSA partners</li>
          <li>Law Enforcement agencies</li>
          <li>Google Analytics</li>
        </ul>
        <p>
          For more information on what is shared with whom, please see &quot;How
          We Use Information&quot;.
        </p>
      </div>
    )
  }

  if (section === "cookie-usage") {
    return (
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          We use various technologies to collect and store information when you
          visit and use a VATUSA service. This may include a cookie or other
          similar technologies to identify your browser or device. We also use
          Google Analytics to help analyze the traffic to our websites and the
          information may be linked, by Google Analytics, with customers for
          information across multiple websites.
        </p>
        <p>
          Our cookies are mainly used as a means of tracking virtual users
          across the VATUSA domain. This allows us to know who is requesting and
          using our services, provide authentication and authorization checks to
          restricted areas.
        </p>
        <p>
          You may choose to disable cookie usage via your browser, but know that
          doing so will prevent access and use across restricted areas of the
          website and severely degrade your experience.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
      <p>
        Given the nature of our services, it is not possible to opt out of data
        collection and use our services. But if you desire to opt out and no
        longer desire to use our services, we will purge all information we have
        collected upon written request.
      </p>
      <p>
        The first step is to deactivate and request VATSIM to purge your data.
        Please head to:
      </p>
      <p>
        <a
          href="https://membership.vatsim.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          https://membership.vatsim.net/
        </a>
      </p>
      <p>
        VATSIM, after processing your opt out, will forward the request to
        VATUSA for processing.
      </p>
      <p>
        Note: VATUSA cannot guarantee that information collected by parties
        outside of VATUSA will be purged in the process.
      </p>
      <p>
        If you need help, visit{" "}
        <Link
          href="/support/faq"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
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
