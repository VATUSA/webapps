"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
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
  { type: "divider", key: "support-divider-1" },
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
  { type: "divider", key: "pilot-divider-1" },
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
  { type: "divider", key: "division-divider-1" },
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
  { type: "divider", key: "division-divider-2" },
  {
    type: "item",
    title: "Events Calendar",
    href: "/events",
    description: "View all VATUSA events.",
    icon: FaCalendar,
  },
  { type: "divider", key: "division-divider-3" },
  {
    type: "item",
    title: "ACE Team",
    href: "/info/ace",
    description: "View all our ACE team.",
    icon: RiTeamLine,
  },
  {
    type: "item",
    title: "Solo Endorsements",
    href: "/info/solo",
    description: "View all active Solo Endorsements.",
    icon: TiStarburst,
  },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Hamburger Button - visible on mobile only */}
      <button
        onClick={toggleMenu}
        className="rounded-md p-2 transition-colors hover:bg-accent md:hidden"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 transform bg-card text-card-foreground shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={closeMenu}
            className="rounded-md p-1 transition-colors hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Content */}
        <nav className="h-[calc(100vh-60px)] overflow-y-auto">
          <div className="space-y-1 px-2 py-4">
            {/* Academy Link */}
            <SidebarLink
              href="https://academy.vatusa.net"
              title="Academy"
              onClose={closeMenu}
            />

            {/* Division Info Section */}
            <SidebarSection
              title="Division Info"
              items={divisionInfo}
              onClose={closeMenu}
            />

            {/* Pilot Tools Section */}
            <SidebarSection
              title="Pilot Tools"
              items={pilotTools}
              onClose={closeMenu}
            />

            {/* Support Section */}
            <SidebarSection
              title="Support"
              items={support}
              onClose={closeMenu}
            />

            {/* Donate Link */}
            <SidebarLink
              href="https://donorbox.org/donate-to-vatusa"
              title="Donate"
              onClose={closeMenu}
            />
          </div>
        </nav>
      </aside>
    </>
  )
}

interface SidebarLinkProps {
  href: string
  title: string
  icon?: MenuIcon
  onClose: () => void
}

function SidebarLink({ href, title, icon: Icon, onClose }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{title}</span>
    </Link>
  )
}

interface SidebarSectionProps {
  title: string
  items: NavMenuEntry[]
  onClose: () => void
}

function SidebarSection({ title, items, onClose }: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
      >
        <span>{title}</span>
        <span
          className={`transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-1 bg-muted/50 px-2 py-2">
          {items.map((item) =>
            item.type === "divider" ? (
              <div
                key={item.key}
                className="my-2 h-px bg-border"
                role="separator"
              />
            ) : (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors hover:bg-accent"
              >
                {item.icon && (
                  <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                )}
                <div className="flex flex-1 flex-col">
                  <span className="font-medium text-foreground">
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  )
}
