"use client"

import * as React from "react"

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
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react"
import { FaBuilding, FaPeopleGroup } from "react-icons/fa6"
import {
  MdAdminPanelSettings,
  MdOutlineAdminPanelSettings,
  MdOutlineGroups3,
} from "react-icons/md"
import { IoSchool } from "react-icons/io5"

const data = {
  user: {
    name: "Web Ten",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "VATUSA",
      logo: <MdAdminPanelSettings />,
      plan: "ARTCC",
    },
    {
      name: "Albuquerque ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Anchorage ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Atlanta ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Boston ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Chicago ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Cleveland ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Denver ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Fort Worth ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Honolulu ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Houston ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Indianapolis ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Jacksonville ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Kansas City ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Los Angeles ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Memphis ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Miami ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Minneapolis ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "New York ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Oakland ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Salt Lake City ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Seattle ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
    {
      name: "Washington, D.C. ARTCC",
      logo: <FaBuilding />,
      plan: "ARTCC",
    },
  ],
  navMain: [
    {
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
      title: "ARTCC Sr Staff",
      url: "#",
      icon: <MdOutlineGroups3 />,
      items: [
        { title: "SR Staff Dashboard", url: "/sr/dashboard" },
        { title: "Pending Transfers", url: "/facility/:id/transfers" },
        { title: "Controller Promotions", url: "/facility/:id/promotions" },
        { title: "Facility Staff POCs", url: "/facility/:id/staff-roles" },
        { title: "Action Log", url: "/facility/:id/log" },
      ],
    },
    {
      title: "ARTCC Staff",
      url: "#",
      icon: <FaPeopleGroup />,
      items: [
        { title: "Facility Dashboard", url: "/facility/:id/dashboard" },
        { title: "Events", url: "" },
        { title: "Tech Config", url: "/facility/:id/tech" },
      ],
    },
    {
      title: "Training Staff",
      url: "#",
      icon: <IoSchool />,
      items: [
        { title: "Training Dashboard", url: "/facility/:id/training" },
        {
          title: "Review Training Notes",
          url: "/facility/:id/training/notes/pending",
        },
        {
          title: "Enter Training Note",
          url: "/facility/:id/training/notes/new",
        },
        { title: "Exam Management", url: "/facility/:id/training/exams" },
        { title: "Ratings & Transfers", url: "/facility/:id/ratings" },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
}

export function AppSideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
