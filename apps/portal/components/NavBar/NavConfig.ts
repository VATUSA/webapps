import type { ComponentType } from "react"
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

export type MenuIcon = ComponentType<{ className?: string }>

export type NavMenuItemEntry = {
  type: "item"
  title: string
  href: string
  description?: string
  icon?: MenuIcon
}

export type NavMenuDividerEntry = {
  type: "divider"
  key: string
}

export type NavMenuEntry = NavMenuItemEntry | NavMenuDividerEntry

export type NavSection = {
  id: "facilities" | "division-info" | "pilot-tools" | "support"
  title: string
  items: NavMenuEntry[]
}

export const NAV_PRIMARY_LINKS = {
  academy: { title: "Academy", href: "https://academy.vatusa.net" },
  faq: { title: "FAQ", href: "/support/faq" },
  ntos_tmu: { title: "N.T.O.S.", href: "/legacy/tmu/notices" },
  join_us: { title: "Join Us", href: "/legacy/info/join" },
  donate: { title: "Donate", href: "https://donorbox.org/donate-to-vatusa" },
} as const

export const FACILITIES: NavMenuEntry[] = [
  {
    type: "item",
    title: "Albuquerque ARTCC",
    href: "https://www.zabartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Anchorage ARTCC",
    href: "https://www.zanartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Atlanta ARTCC",
    href: "https://www.ztlartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Boston ARTCC",
    href: "https://www.bvartcc.com/",
    description: "",
  },
  {
    type: "item",
    title: "Chicago ARTCC",
    href: "https://www.zauartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Cleveland ARTCC",
    href: "https://clevelandcenter.org/",
    description: "",
  },
  {
    type: "item",
    title: "Denver ARTCC",
    href: "https://zdvartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Fort Worth ARTCC",
    href: "https://www.zfwartcc.net/",
    description: "",
  },
  {
    type: "item",
    title: "Honolulu CF",
    href: "https://www.vhcf.net/",
    description: "",
  },
  {
    type: "item",
    title: "Houston ARTCC",
    href: "https://houston.center/",
    description: "",
  },
  {
    type: "item",
    title: "Indianapolis ARTCC",
    href: "https://flyindycenter.com/",
    description: "",
  },
  {
    type: "item",
    title: "Jacksonville ARTCC",
    href: "https://zjxartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Kansas City ARTCC",
    href: "https://vzkc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Los Angeles ARTCC",
    href: "https://laartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Memphis ARTCC",
    href: "https://memphisartcc.com/",
    description: "",
  },
  {
    type: "item",
    title: "Miami ARTCC",
    href: "https://www.zmaartcc.net/",
    description: "",
  },
  {
    type: "item",
    title: "Minneapolis ARTCC",
    href: "https://minniecenter.org/",
    description: "",
  },
  {
    type: "item",
    title: "New York ARTCC",
    href: "https://nyartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Oakland ARTCC",
    href: "https://oakartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Salt Lake City ARTCC",
    href: "https://zlcartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Seattle ARTCC",
    href: "https://zseartcc.org/",
    description: "",
  },
  {
    type: "item",
    title: "Washington, D.C. ARTCC",
    href: "https://www.vzdc.org/",
    description: "",
  },
]

export const DIVISION_INFO: NavMenuEntry[] = [
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
    href: "/legacy/info/members", // TODO: Revert to /info/members-staff once that page is fixed
    description: "Learn more about our members and staff.",
    icon: TiGroup,
  },
  {
    type: "item",
    title: "Policies and Downloads",
    href: "/legacy/info/policies", // TODO: Revert to /info/policies once doc management is implemented
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
    href: "/legacy/info/solo",
    description: "View all active Solo Endorsements.",
    icon: TiStarburst,
  },
]

export const PILOT_TOOLS: NavMenuEntry[] = [
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

export const SUPPORT: NavMenuEntry[] = [
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
    href: "/legacy/help/ticket/new",
    description: "",
    icon: FaTicket,
  },
]

export const NAV_SECTIONS: NavSection[] = [
  { id: "facilities", title: "Facilities", items: FACILITIES },
  { id: "division-info", title: "Division Info", items: DIVISION_INFO },
  { id: "pilot-tools", title: "Pilot Tools", items: PILOT_TOOLS },
  { id: "support", title: "Support", items: SUPPORT },
]
