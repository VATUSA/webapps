"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import type { CobaltPermission } from "@workspace/third-party/cobalt"
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
import { FaBuilding, FaNewspaper, FaPeopleGroup } from "react-icons/fa6"
import { MdAdminPanelSettings } from "react-icons/md"
import { IoSchool } from "react-icons/io5"
import { MdEventNote, MdSettings } from "react-icons/md"
import {
  ACTION,
  OBJECT,
  hasFacilityScopedPermission,
  hasPermission,
} from "@/lib/acl"

type AppSideBarProps = React.ComponentProps<typeof Sidebar> & {
  userName?: string
  globalPermissions?: CobaltPermission[]
  facilityPermissions?: CobaltPermission[]
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
    id: "ZHQ",
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
    title: "Roster Management",
    url: "#",
    icon: <FaPeopleGroup />,
    isClickable: false,
    items: [
      { title: "Full Roster", url: "/facility/:id/roster" },
      { title: "Home", url: "/facility/:id/roster/home" },
      { title: "Visitors", url: "/facility/:id/roster/visit" },
      { title: "Transfer Requests", url: "/facility/:id/requests/transfer" },
      { title: "Visit Requests", url: "/facility/:id/requests/visit" },
    ],
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
      { title: "Staff POCs", url: "/facility/:id/staff/poc" },
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
 * Headquarters Navigation Structure
 */
const getZhqNavMain = (): NavItem[] => [
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
      { title: "Staff POCs", url: "/facility/:id/roles/poc" },
    ],
  },
]


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

function filterCreateLinks(
  items: readonly NavItem[],
  input: { canCreateEvent: boolean; canCreateNews: boolean }
): NavItem[] {
  return items.map((item) => ({
    ...item,
    items: item.items?.filter((subItem) => {
      if (subItem.title === "New Event") return input.canCreateEvent
      if (subItem.title === "New Post") return input.canCreateNews
      return true
    }),
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
  globalPermissions = [],
  facilityPermissions = [],
  ...props
}: AppSideBarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [activeTeam, setActiveTeam] = React.useState<Team>(teams[0])

  React.useEffect(() => {
    const fromPath = getTeamFromPathname(pathname, teams)
    if (fromPath) {
      setActiveTeam((prev) => (prev.id === fromPath.id ? prev : fromPath))
      window.localStorage.setItem(TEAM_STORAGE_KEY, fromPath.id)
      return
    }

    const savedId = window.localStorage.getItem(TEAM_STORAGE_KEY)?.toUpperCase()
    if (!savedId) return

    const savedTeam = teams.find((t) => t.id.toUpperCase() === savedId)
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

  const isZhqTeam = activeTeam.id.toUpperCase() === "ZHQ"
  const canCreateEvent = hasFacilityScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.event,
    action: ACTION.write,
    facilityId: activeTeam.id,
    allowSuperAdmin: false,
  })
  const canCreateNews = hasPermission(
    globalPermissions,
    OBJECT.newsPost,
    ACTION.write
  )

  const navSource = isZhqTeam ? getZhqNavMain() : getArtccNavMain()

  const updatedNavMain = React.useMemo(
    () =>
      replaceIdInUrls(
        filterCreateLinks(navSource, { canCreateEvent, canCreateNews }),
        activeTeam.id.toLowerCase()
      ),
    [activeTeam.id, canCreateEvent, canCreateNews, navSource]
  )

  // Prepare user data from session
  const resolvedUserName = userName ?? "Staff User"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavSwitcher
          teams={teams}
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
