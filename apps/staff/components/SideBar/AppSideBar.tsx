"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { NavMain, type NavItem } from "@/components/SideBar/NavMain"
import { NavUser } from "@/components/SideBar/NavUser"
import { NavSwitcher } from "@/components/SideBar/NavSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import { FrameIcon, PieChartIcon, MapIcon } from "lucide-react"
import { FaBuilding, FaNewspaper, FaPeopleGroup } from "react-icons/fa6"
import { MdOutlineGroups3, MdAdminPanelSettings } from "react-icons/md"
import { IoSchool } from "react-icons/io5"
import { GrDocumentUser } from "react-icons/gr"
import { MdEventNote, MdSettings } from "react-icons/md"
import { TbTransfer } from "react-icons/tb"

type AppSideBarProps = React.ComponentProps<typeof Sidebar> & {
  userName?: string
}

type Team = {
  name: string
  logo: React.ReactNode
  plan: string
  id: string
}

const teams = [
  {
    name: "VATUSA",
    logo: <MdAdminPanelSettings />,
    plan: "ARTCC",
    id: "USA",
  },
  {
    name: "Albuquerque ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZAB",
  },
  {
    name: "Anchorage ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZAK",
  },
  {
    name: "Atlanta ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZTL",
  },
  {
    name: "Boston ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZBW",
  },
  {
    name: "Chicago ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZAU",
  },
  {
    name: "Cleveland ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZOB",
  },
  {
    name: "Denver ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZDV",
  },
  {
    name: "Fort Worth ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZFW",
  },
  {
    name: "Honolulu ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "HCF",
  },
  {
    name: "Houston ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZHU",
  },
  {
    name: "Indianapolis ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZID",
  },
  {
    name: "Jacksonville ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZJX",
  },
  {
    name: "Kansas City ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZKC",
  },
  {
    name: "Los Angeles ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZLA",
  },
  {
    name: "Memphis ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZME",
  },
  {
    name: "Miami ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZMA",
  },
  {
    name: "Minneapolis ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZMP",
  },
  {
    name: "New York ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZNY",
  },
  {
    name: "Oakland ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZOA",
  },
  {
    name: "Salt Lake City ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZLC",
  },
  {
    name: "Seattle ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZSE",
  },
  {
    name: "Washington, D.C. ARTCC",
    logo: <FaBuilding />,
    plan: "ARTCC",
    id: "ZDC",
  },
] as const satisfies Team[]

/**
 * ARTCC Navigation Structure
 * Combines roster, requests, training, events, role management, and facility config
 */
const getArtccNavMain = (): NavItem[] => [
  // Roster Management Section
  {
    title: "Roster",
    url: "/facility/:id/roster",
    icon: <FaPeopleGroup />,
    isClickable: true,
  },
  {
    title: "Home",
    url: "/facility/:id/roster/home",
    icon: <FaBuilding />,
    isClickable: true,
  },
  {
    title: "Visitors",
    url: "/facility/:id/roster/visit",
    icon: <FaPeopleGroup />,
    isClickable: true,
  },
  {
    title: "Transfer Requests",
    url: "/facility/:id/requests/transfer",
    icon: <TbTransfer />,
    isClickable: true,
  },
  {
    title: "Visit Requests",
    url: "/facility/:id/requests/visit",
    icon: <GrDocumentUser />,
    isClickable: true,
  },

  // Staff POCs
  {
    title: "Staff POCs",
    url: "/facility/:id/staff/poc",
    icon: <MdOutlineGroups3 />,
    isClickable: true,
  },

  // Training Section
  {
    title: "Training",
    url: "#",
    icon: <IoSchool />,
    isClickable: false,
    items: [
      { title: "Training Dashboard", url: "/facility/:id/training/dashboard" },
      { title: "Training Notes", url: "/facility/:id/training/notes" },
      {
        title: "Controller Promotion",
        url: "/facility/:id/training/promotion",
      },
    ],
  },

  // Events Section
  {
    title: "Events",
    url: "#",
    icon: <MdEventNote />,
    isClickable: false,
    items: [
      { title: "Manage Events", url: "/facility/:id/events/manage" },
      { title: "New Event", url: "/facility/:id/events/new" },
    ],
  },

  // News Section
  {
    title: "News",
    url: "#",
    icon: <FaNewspaper />,
    isClickable: false,
    items: [
      { title: "Manage Posts", url: "/facility/:id/news" },
      { title: "New Post", url: "/facility/:id/news/new" },
    ],
  },

  // Role Management Section
  {
    title: "Role Management",
    url: "#",
    icon: <MdAdminPanelSettings />,
    isClickable: false,
    items: [
      { title: "Role Assignments", url: "/facility/:id/roles/assignments" },
      { title: "Assign Role", url: "/facility/:id/roles/assignments/new" },
    ],
  },

  // Facility Configuration Section
  {
    title: "Facility Config",
    url: "#",
    icon: <MdSettings />,
    isClickable: false,
    items: [
      { title: "Basic Info", url: "/facility/:id/facility/info" },
      { title: "Tech Config", url: "/facility/:id/facility/tech" },
      {
        title: "Notification Config",
        url: "/facility/:id/facility/notification",
      },
      { title: "Discord Bot Config", url: "/facility/:id/facility/discord" },
    ],
  },
]

/**
 * USA Division Navigation Structure
 */
const getUsaNavMain = (): NavItem[] => [
  // Staff POCs
  {
    title: "Staff POCs",
    url: "/facility/:id/staff/poc",
    icon: <MdOutlineGroups3 />,
    isClickable: true,
  },
  // Events Section
  {
    title: "Events",
    url: "#",
    icon: <MdEventNote />,
    isClickable: false,
    items: [
      { title: "Manage Events", url: "/facility/:id/events/manage" },
      { title: "New Event", url: "/facility/:id/events/new" },
    ],
  },
  // News Section
  {
    title: "News",
    url: "#",
    icon: <FaNewspaper />,
    isClickable: false,
    items: [
      { title: "Manage Posts", url: "/facility/:id/news" },
      { title: "New Post", url: "/facility/:id/news/new" },
    ],
  },
  // Role Management Section
  {
    title: "Role Management",
    url: "#",
    icon: <MdAdminPanelSettings />,
    isClickable: false,
    items: [
      { title: "Role Assignments", url: "/facility/:id/roles/assignments" },
      { title: "Assign Role", url: "/facility/:id/roles/assignments/new" },
    ],
  },
]

const data = {
  user: {
    name: "Web Ten",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams,
  projects: [
    { name: "Design Engineering", url: "#", icon: <FrameIcon /> },
    { name: "Sales & Marketing", url: "#", icon: <PieChartIcon /> },
    { name: "Travel", url: "#", icon: <MapIcon /> },
  ],
}

function replaceIdInUrls(
  items: readonly NavItem[],
  facilityId: string
): NavItem[] {
  return items.map((item) => ({
    ...item,
    url: item.url.replace(":id", facilityId),
    items: item.items?.map((subItem) => ({
      ...subItem,
      url: subItem.url.replace(":id", facilityId),
    })),
  }))
}

const TEAM_STORAGE_KEY = "staff.activeTeamId"

function getTeamFromPathname(pathname: string, allTeams: readonly Team[]) {
  const match = pathname.match(/^\/facility\/([^/]+)(?:\/|$)/i)
  const idFromUrl = match?.[1]?.toUpperCase()
  if (!idFromUrl) return null

  return allTeams.find((t) => t.id.toUpperCase() === idFromUrl) ?? null
}

function swapFacilityInPath(pathname: string, newTeamId: string) {
  const newSlug = newTeamId.toLowerCase()

  if (/^\/facility\/[^/]+(?:\/|$)/i.test(pathname)) {
    return pathname.replace(/^\/facility\/[^/]+/i, `/facility/${newSlug}`)
  }

  return `/facility/${newSlug}`
}

export function AppSideBar({
  userName,
  ...props
}: AppSideBarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [activeTeam, setActiveTeam] = React.useState<Team>(data.teams[0])

  React.useEffect(() => {
    const fromPath = getTeamFromPathname(pathname, data.teams)
    if (fromPath) {
      setActiveTeam((prev) => (prev.id === fromPath.id ? prev : fromPath))
      window.localStorage.setItem(TEAM_STORAGE_KEY, fromPath.id)
      return
    }

    const savedId = window.localStorage.getItem(TEAM_STORAGE_KEY)?.toUpperCase()
    if (!savedId) return

    const savedTeam = data.teams.find((t) => t.id.toUpperCase() === savedId)
    if (savedTeam) {
      setActiveTeam((prev) => (prev.id === savedTeam.id ? prev : savedTeam))
    }
  }, [pathname])

  const onTeamChangeAction = React.useCallback(
    (team: Team) => {
      setActiveTeam(team)
      window.localStorage.setItem(TEAM_STORAGE_KEY, team.id)

      const nextPath = swapFacilityInPath(pathname, team.id)
      if (nextPath !== pathname) {
        router.replace(nextPath)
      }
    },
    [pathname, router]
  )

  const isUsaTeam = activeTeam.id.toUpperCase() === "USA"

  // Get navigation items based on facility type (all items visible to all users)
  const navSource = isUsaTeam ? getUsaNavMain() : getArtccNavMain()

  // Replace :id placeholder with actual facility ID
  const updatedNavMain = React.useMemo(
    () => replaceIdInUrls(navSource, activeTeam.id.toLowerCase()),
    [navSource, activeTeam.id]
  )

  // Prepare user data from session
  const resolvedUserName = userName ?? "Staff User"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavSwitcher
          teams={data.teams}
          activeTeam={activeTeam}
          onTeamChangeAction={onTeamChangeAction}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={updatedNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: resolvedUserName }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
