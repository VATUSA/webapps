"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { NavMain } from "@/components/SideBar/NavMain"
import { NavProjects } from "@/components/SideBar/NavProjects"
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
import { FaBuilding, FaPeopleGroup } from "react-icons/fa6"
import { MdOutlineGroups3, MdAdminPanelSettings } from "react-icons/md"
import { IoSchool } from "react-icons/io5"
import { buildStaffSidebarCapabilities } from "@/lib/acl"
import type { CobaltPermission } from "@/lib/session"

type AppSideBarProps = React.ComponentProps<typeof Sidebar> & {
  globalPermissions: CobaltPermission[]
  facilityPermissions: CobaltPermission[]
}

type Team = {
  name: string
  logo: React.ReactNode
  plan: string
  id: string
}

type NavSectionKey =
  | "overview"
  | "srStaff"
  | "artccStaff"
  | "trainingStaff"
  | "usaOverview"
  | "divisionStaff"

type NavItem = {
  key: NavSectionKey
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
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

const artccNavMain = [
  {
    key: "overview",
    title: "ARTCC Overview",
    url: "#",
    icon: <FaBuilding />,
    items: [
      { title: "ARTCC Dashboard", url: "/facility/:id/dashboard" },
      { title: "Home Roster", url: "/facility/:id/roster" },
      { title: "Visiting Roster", url: "/facility/:id/visitors" },
      { title: "Staff Page", url: "/facility/:id/staff" },
    ],
  },
  {
    key: "srStaff",
    title: "ARTCC Sr Staff",
    url: "#",
    icon: <MdOutlineGroups3 />,
    items: [
      { title: "SR Staff Dashboard", url: "/sr/dashboard" },
      { title: "Pending Transfers", url: "/facility/:id/transfers" },
      { title: "Facility Staff POCs", url: "/facility/:id/staff-roles" },
      { title: "Action Log", url: "/facility/:id/log" },
    ],
  },
  {
    key: "artccStaff",
    title: "ARTCC Staff",
    url: "#",
    icon: <FaPeopleGroup />,
    items: [
      { title: "Staff Dashboard", url: "/facility/:id/staff" },
      { title: "Events", url: "/facility/:id/staff/events" },
      { title: "Tech Config", url: "/facility/:id/staff/tech" },
    ],
  },
  {
    key: "trainingStaff",
    title: "Training Staff",
    url: "#",
    icon: <IoSchool />,
    items: [
      { title: "Training Dashboard", url: "/facility/:id/training" },
      { title: "Training Notes", url: "/facility/:id/training/notes" },
      {
        title: "Controller Promotion",
        url: "/facility/:id/training/promotion",
      },
    ],
  },
] as const satisfies readonly NavItem[]

const usaNavMain = [
  {
    key: "usaOverview",
    title: "Overview",
    url: "#",
    icon: <MdAdminPanelSettings />,
    items: [{ title: "Division Overview", url: "/facility/:id/overview" }],
  },
  {
    key: "divisionStaff",
    title: "Division Staff",
    url: "#",
    icon: <FaPeopleGroup />,
    items: [
      { title: "Division Events", url: "/facility/:id/division/events" },
      { title: "Division Staff", url: "/facility/:id/division/staff" },
    ],
  },
] as const satisfies readonly NavItem[]

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

function norm(value: string | undefined) {
  return value?.trim().toLowerCase() ?? ""
}

function hasPermission(
  perms: CobaltPermission[] | undefined,
  object: string,
  action?: string
) {
  if (!Array.isArray(perms)) return false
  const obj = norm(object)
  const act = action ? norm(action) : ""

  return perms.some((p) => {
    if (norm(p.object) !== obj) return false
    if (!act) return true
    return norm(p.action) === act
  })
}

function buildUsaSidebarCapabilities(globalPermissions: CobaltPermission[]) {
  const isSuperAdmin = hasPermission(globalPermissions, "superadmin", "usage")
  const isDivisionManagement = hasPermission(
    globalPermissions,
    "division_management_role"
  )
  const isDivisionStaff = hasPermission(
    globalPermissions,
    "division_staff_role"
  )
  const isDivision = isDivisionManagement || isDivisionStaff

  return {
    canSeeUsaOverview: isSuperAdmin || isDivision,
    canSeeDivisionStaff: isSuperAdmin || isDivision,
  }
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

  return `/facility/${newSlug}/overview`
}

export function AppSideBar({
  globalPermissions,
  facilityPermissions,
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

  const capabilities = React.useMemo(
    () =>
      buildStaffSidebarCapabilities({
        globalPermissions,
        facilityPermissions,
        facilityId: activeTeam.id,
      }),
    [globalPermissions, facilityPermissions, activeTeam.id]
  )

  const usaCapabilities = React.useMemo(
    () => buildUsaSidebarCapabilities(globalPermissions),
    [globalPermissions]
  )

  const navSource = isUsaTeam ? usaNavMain : artccNavMain

  const permittedNavMain = React.useMemo(
    () =>
      navSource.filter((item) => {
        if (!isUsaTeam) {
          if (item.key === "overview") return capabilities.canSeeOverview
          if (item.key === "srStaff") return capabilities.canSeeSrStaff
          if (item.key === "artccStaff") return capabilities.canSeeArtccStaff
          if (item.key === "trainingStaff")
            return capabilities.canSeeTrainingStaff
          return false
        }

        if (item.key === "usaOverview") return usaCapabilities.canSeeUsaOverview
        if (item.key === "divisionStaff")
          return usaCapabilities.canSeeDivisionStaff
        return false
      }),
    [navSource, isUsaTeam, capabilities, usaCapabilities]
  )

  const updatedNavMain = replaceIdInUrls(
    permittedNavMain,
    activeTeam.id.toLowerCase()
  )

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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
