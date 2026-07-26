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
import { FaNewspaper, FaPeopleGroup } from "react-icons/fa6"
import { MdAdminPanelSettings, MdEventNote, MdSettings } from "react-icons/md"
import { IoSchool } from "react-icons/io5"
import {
  ACTION,
  OBJECT,
  hasFacilityScopedPermission,
  hasScopedPermission,
} from "@/lib/acl"

type AppSideBarProps = React.ComponentProps<typeof Sidebar> & {
  userName?: string
  globalPermissions?: CobaltPermission[]
  facilityPermissions?: CobaltPermission[]
  homeFacility?: string
}

type Team = {
  name: string
  logoSrc: string
  plan: string
  id: string
}

const teams = [
  {
    name: "VATUSA",
    logoSrc: "/staff/ARTCC-Logos/ZHQ.png",
    plan: "Division",
    id: "ZHQ",
  },
  {
    name: "Albuquerque ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZAB.png",
    plan: "Subdivision",
    id: "ZAB",
  },
  {
    name: "Anchorage ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZAK.png",
    plan: "Subdivision",
    id: "ZAK",
  },
  {
    name: "Atlanta ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZTL.png",
    plan: "Subdivision",
    id: "ZTL",
  },
  {
    name: "Boston ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZBW.png",
    plan: "Subdivision",
    id: "ZBW",
  },
  {
    name: "Chicago ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZAU.png",
    plan: "Subdivision",
    id: "ZAU",
  },
  {
    name: "Cleveland ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZOB.png",
    plan: "Subdivision",
    id: "ZOB",
  },
  {
    name: "Denver ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZDV.png",
    plan: "Subdivision",
    id: "ZDV",
  },
  {
    name: "Fort Worth ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZFW.png",
    plan: "Subdivision",
    id: "ZFW",
  },
  {
    name: "Honolulu ARTCC",
    logoSrc: "/staff/ARTCC-Logos/HCF.png",
    plan: "Subdivision",
    id: "HCF",
  },
  {
    name: "Houston ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZHU.png",
    plan: "Subdivision",
    id: "ZHU",
  },
  {
    name: "Indianapolis ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZID.png",
    plan: "Subdivision",
    id: "ZID",
  },
  {
    name: "Jacksonville ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZJX.png",
    plan: "Subdivision",
    id: "ZJX",
  },
  {
    name: "Kansas City ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZKC.png",
    plan: "Subdivision",
    id: "ZKC",
  },
  {
    name: "Los Angeles ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZLA.png",
    plan: "Subdivision",
    id: "ZLA",
  },
  {
    name: "Memphis ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZME.png",
    plan: "Subdivision",
    id: "ZME",
  },
  {
    name: "Miami ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZMA.png",
    plan: "Subdivision",
    id: "ZMA",
  },
  {
    name: "Minneapolis ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZMP.png",
    plan: "Subdivision",
    id: "ZMP",
  },
  {
    name: "New York ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZNY.png",
    plan: "Subdivision",
    id: "ZNY",
  },
  {
    name: "Oakland ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZOA.png",
    plan: "Subdivision",
    id: "ZOA",
  },
  {
    name: "Salt Lake City ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZLC.png",
    plan: "Subdivision",
    id: "ZLC",
  },
  {
    name: "Seattle ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZSE.png",
    plan: "Subdivision",
    id: "ZSE",
  },
  {
    name: "Washington, D.C. ARTCC",
    logoSrc: "/staff/ARTCC-Logos/ZDC.png",
    plan: "Subdivision",
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
    permissionGate: "events_manage",
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
    permissionGate: "news_manage",
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
    permissionGate: "events_manage",
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
    permissionGate: "news_manage",
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

function filterNavByPermissions(
  items: readonly NavItem[],
  input: { canManageEvents: boolean; canManageNews: boolean }
): NavItem[] {
  return items.filter((item) => {
    if (item.permissionGate === "events_manage" && !input.canManageEvents) {
      return false
    }

    if (item.permissionGate === "news_manage" && !input.canManageNews) {
      return false
    }

    if (!item.isClickable && Array.isArray(item.items) && item.items.length === 0) {
      return false
    }

    return true
  })
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
  homeFacility,
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
    const savedTeam = savedId
      ? teams.find((t) => t.id.toUpperCase() === savedId)
      : undefined
    if (savedTeam) {
      setActiveTeam((prev) => (prev.id === savedTeam.id ? prev : savedTeam))
      return
    }

    const homeTeam = homeFacility
      ? teams.find((t) => t.id.toUpperCase() === homeFacility.toUpperCase())
      : undefined
    if (homeTeam) {
      setActiveTeam((prev) => (prev.id === homeTeam.id ? prev : homeTeam))
    }
  }, [pathname, homeFacility])

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

  const accessibleTeamIds = React.useMemo(() => {
    const ids = new Set<string>(
      facilityPermissions
        .map((p) => p.facility?.toUpperCase())
        .filter((f): f is string => Boolean(f))
    )
    if (globalPermissions.length > 0) {
      ids.add("ZHQ")
    }
    return ids
  }, [facilityPermissions, globalPermissions])

  const teamsForSwitcher = React.useMemo(
    () =>
      teams.map((team) => ({
        ...team,
        disabled: !accessibleTeamIds.has(team.id.toUpperCase()),
      })),
    [accessibleTeamIds]
  )

  const isZhqTeam = activeTeam.id.toUpperCase() === "ZHQ"
  const canManageEvents = hasFacilityScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.event,
    action: ACTION.write,
    facilityId: activeTeam.id,
  })
  const canManageNews = hasScopedPermission({
    globalPermissions,
    facilityPermissions,
    object: OBJECT.newsPost,
    action: ACTION.write,
    facilityId: activeTeam.id,
  })

  const navSource = isZhqTeam ? getZhqNavMain() : getArtccNavMain()

  const updatedNavMain = React.useMemo(
    () =>
      replaceIdInUrls(
        filterNavByPermissions(navSource, { canManageEvents, canManageNews }),
        activeTeam.id.toLowerCase()
      ),
    [activeTeam.id, canManageEvents, canManageNews, navSource]
  )

  // Prepare user data from session
  const resolvedUserName = userName ?? "Staff User"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavSwitcher
          teams={teamsForSwitcher}
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
