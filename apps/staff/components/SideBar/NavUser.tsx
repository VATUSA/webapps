"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { ChevronsUpDownIcon, LogOutIcon, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { FaHome } from "react-icons/fa"

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return "U"

  const [first = "", second = ""] = parts

  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase()
  }

  return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase()
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    avatar?: string
  }
}) {
  const { isMobile } = useSidebar()

  const cobaltDefaultUrl =
    process.env.NEXT_PUBLIC_COBALT_EXTERNAL_BASE_URL ??
    "http://localhost:8000/cobalt"

  const handleProfileClick = () => {
    window.open("/profile", "_blank")
  }

  const handleHomeClick = () => {
    window.open("/", "_blank")
  }


  const handleLogoutClick = () => {
    window.location.href = `${cobaltDefaultUrl}/login/logout`
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              {/* Avatar photos are temporarily disabled until profile image support is implemented. */}
              {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
              <AvatarFallback className="bg-primary font-medium text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>
                    {/* Avatar photos are temporarily disabled until profile image support is implemented. */}
                    {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                    <AvatarFallback className="bg-primary font-medium text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfileClick}>
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleHomeClick}>
                <FaHome />
                VATUSA
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogoutClick}>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
