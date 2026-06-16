"use client"

import { ChevronDownIcon, LogOutIcon, UserIcon, ShieldIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { buttonVariants } from "@workspace/ui/lib/button-variants"
import { cn } from "@workspace/ui/lib/utils"

const legacyManagementUrl = "/legacy/mgt/facility"

type LoginDropdownProps = {
  isLoggedIn: boolean
  name?: string
  myVatusaProfileUrl: string
  staffAppUrl: string
  canAccessStaffApp: boolean
  cobaltBaseUrl: string
}

export default function LoginButton({
  isLoggedIn,
  name,
  myVatusaProfileUrl,
  staffAppUrl,
  canAccessStaffApp,
  cobaltBaseUrl,
}: LoginDropdownProps) {
  if (!isLoggedIn) {
    return (
      <a
        href={`${cobaltBaseUrl}/login`}
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "px-4"
        )}
      >
        Log In
      </a>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-2 px-3"
        )}
      >
        <UserIcon className="size-4" />
        <span className="max-w-36 truncate">{name ?? "Controller"}</span>
        <ChevronDownIcon className="size-4 opacity-70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            Signed in as {name ?? "Controller"}
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => window.open(myVatusaProfileUrl)}>
            <UserIcon className="size-4" />
            My VATUSA Profile
          </DropdownMenuItem>

          {canAccessStaffApp ? (
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => window.open(staffAppUrl)}>
                <ShieldIcon className="size-4" />
                Staff Management
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(legacyManagementUrl)}
              >
                <ShieldIcon className="size-4" />
                Legacy Management
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : null}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => (window.location.href = "/api/auth/logout")}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-9 w-full justify-start px-2"
          )}
        >
          <LogOutIcon className="size-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
