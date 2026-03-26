"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu"
import {
  FaDiscord,
  FaCalendar,
  FaStar,
  FaSchool,
  FaPlane,
  FaCloud,
  FaQuestion,
} from "react-icons/fa"
import { TiGroup, TiStarburst } from "react-icons/ti"
import { GoFileSubmodule } from "react-icons/go"
import { RiTeamLine } from "react-icons/ri"
import { ImStatsDots } from "react-icons/im"
import { IoIosDocument } from "react-icons/io"
import { CiRoute } from "react-icons/ci"
import { FaTicket } from "react-icons/fa6"
import { HiOutlineStatusOnline } from "react-icons/hi"

type MenuIcon = React.ComponentType<{ className?: string }>

type NavMenuItemEntry = {
  type: "item"
  title: string
  href: string
  description?: string
  icon?: MenuIcon
}

type NavMenuDividerEntry = {
  type: "divider"
  key: string
}

type NavMenuEntry = NavMenuItemEntry | NavMenuDividerEntry

const support: NavMenuEntry[] = [
  {
    type: "item",
    title: "System Status",
    href: "https://status.vatusa.net",
    description: "",
    icon: HiOutlineStatusOnline,
  },
  { type: "divider", key: "core-divider" },
  {
    type: "item",
    title: "FAQ",
    href: "/support/faq",
    description: "",
    icon: FaQuestion,
  },
  {
    type: "item",
    title: "Support Tickets",
    href: "/support/tickets",
    description: "",
    icon: FaTicket,
  },
]

const pilotTools: NavMenuEntry[] = [
  {
    type: "item",
    title: "Getting Started",
    href: "https://vatsim.net/docs/basics/getting-started/",
    description: "",
    icon: FaStar,
  },
  {
    type: "item",
    title: "Training",
    href: "https://my.vatsim.net/learn",
    description: "",
    icon: FaSchool,
  },
  {
    type: "item",
    title: "Virtual Airlines",
    href: "https://my.vatsim.net/virtual-airlines",
    description: "",
    icon: FaPlane,
  },
  {
    type: "item",
    title: "VATSIM Stats",
    href: "https://stats.vatsim.net/",
    description: "",
    icon: ImStatsDots,
  },
  { type: "divider", key: "core-divider" },
  {
    type: "item",
    title: "Charts",
    href: "https://skyvector.com",
    description: "",
    icon: IoIosDocument,
  },
  {
    type: "item",
    title: "Routes",
    href: "https://flightaware.com/statistics/ifr-routes/",
    description: "",
    icon: CiRoute,
  },
  {
    type: "item",
    title: "Weather",
    href: "/tools/weather",
    description: "",
    icon: FaCloud,
  },
]

const divisionInfo: NavMenuEntry[] = [
  {
    type: "item",
    title: "Official Discord",
    href: "/info/discord",
    description: "Click to join VATUSA's Offical Discord.",
    icon: FaDiscord,
  },
  { type: "divider", key: "core-divider-1" },
  {
    type: "item",
    title: "Members and Staff",
    href: "/info/members-staff",
    description: "Learn more about our members and staff.",
    icon: TiGroup,
  },
  {
    type: "item",
    title: "Policies and Downloads",
    href: "/info/policies",
    description: "Rules and governing documents.",
    icon: GoFileSubmodule,
  },
  { type: "divider", key: "core-divider-2" },
  {
    type: "item",
    title: "Events Calendar",
    href: "/events",
    description: "View all VATUSA events.",
    icon: FaCalendar,
  },
  { type: "divider", key: "core-divider-3" },
  {
    type: "item",
    title: "ACE Team",
    href: "/info/ace",
    description: "View all our ACE team.",
    icon: RiTeamLine,
  },
  {
    type: "item",
    title: "Solo Certs",
    href: "/info/solo",
    description: "View all active Solo Certs.",
    icon: TiStarburst,
  },
]

const facilities: NavMenuEntry[] = [
  {
    type: "item",
    title: "Albuquerque ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Anchorage ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Atlanta ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Boston ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Chicago ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Cleveland ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Denver ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Fort Worth ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Honolulu ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Houston ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Indianapolis ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Jacksonville ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Kansas City ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Los Angeles ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Memphis ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Miami ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Minneapolis ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "New York ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Oakland ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Salt Lake City ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Seattle ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
  {
    type: "item",
    title: "Washington, D.C. ARTCC",
    href: "/docs/primitives/alert-dialog",
    description: "",
  },
]

export function NavButtons() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="https://academy.vatusa.net">Academy</Link>}
          />
          <NavigationMenuTrigger>Facilities</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col gap-0">
              {facilities.map((entry) =>
                entry.type === "divider" ? (
                  <li
                    key={entry.key}
                    role="separator"
                    className="my-1 h-px bg-border"
                  />
                ) : (
                  <ListItem key={entry.title} {...entry}>
                    {entry.description}
                  </ListItem>
                )
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuTrigger>Division Info</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col gap-1">
              {divisionInfo.map((entry) =>
                entry.type === "divider" ? (
                  <li
                    key={entry.key}
                    role="separator"
                    className="my-1 h-px bg-border"
                  />
                ) : (
                  <ListItem key={entry.title} {...entry}>
                    {entry.description}
                  </ListItem>
                )
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuTrigger>Pilot Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col gap-0">
              {pilotTools.map((entry) =>
                entry.type === "divider" ? (
                  <li
                    key={entry.key}
                    role="separator"
                    className="my-1 h-px bg-border"
                  />
                ) : (
                  <ListItem key={entry.title} {...entry}>
                    {entry.description}
                  </ListItem>
                )
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:flex">
          <NavigationMenuTrigger>Support</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col gap-0">
              {support.map((entry) =>
                entry.type === "divider" ? (
                  <li
                    key={entry.key}
                    role="separator"
                    className="my-1 h-px bg-border"
                  />
                ) : (
                  <ListItem key={entry.title} {...entry}>
                    {entry.description}
                  </ListItem>
                )
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="https://donorbox.org/donate-to-vatusa">Donate</Link>}
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & NavMenuItemEntry) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link href={href} className="flex items-start gap-2">
            {Icon ? (
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            ) : null}
            <div className="flex flex-col gap-1 text-sm">
              <div className="leading-none font-medium">{title}</div>
              {children ? (
                <div className="line-clamp-2 text-muted-foreground">
                  {children}
                </div>
              ) : null}
            </div>
          </Link>
        }
      />
    </li>
  )
}
