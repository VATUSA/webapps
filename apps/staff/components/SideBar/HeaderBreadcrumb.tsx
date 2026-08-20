"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

const SEGMENT_LABELS: Record<string, string> = {
  roster: "Roster",
  home: "Home",
  visit: "Visitors",
  requests: "Requests",
  transfer: "Transfer Requests",
  training: "Training",
  dashboard: "Dashboard",
  notes: "Training Notes",
  promotion: "Controller Promotion",
  events: "Events",
  manage: "Manage",
  "ace-team": "ACE Team Management",
  new: "New",
  edit: "Edit",
  news: "News",
  roles: "Role Management",
  assignments: "Assignments",
  poc: "Staff POCs",
  staff: "Staff",
  facility: "Facility",
  info: "Basic Info",
  tech: "Tech Config",
  notification: "Notifications",
  discord: "Discord Bot",
}

function toTitleCase(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

type Crumb = {
  label: string
  href: string
}

function buildCrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean)
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }]

  let href = ""
  segments.forEach((segment, index) => {
    href += `/${segment}`

    if (segment === "facility") return

    const label =
      segments[0] === "facility" && index === 1
        ? segment.toUpperCase()
        : (SEGMENT_LABELS[segment] ?? toTitleCase(segment))

    crumbs.push({ label, href })
  })

  return crumbs
}

export function HeaderBreadcrumb() {
  const pathname = usePathname()
  const crumbs = React.useMemo(() => buildCrumbs(pathname), [pathname])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <React.Fragment key={crumb.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
