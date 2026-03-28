"use client"

import { ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import { cobalt } from "@workspace/third-party"

type LoginDropdownProps = {
  isLoggedIn: boolean
  name?: string
}

export default function LoginButton({ isLoggedIn, name }: LoginDropdownProps) {
  if (!isLoggedIn) {
    return (
      <a
        href={cobalt.getLoginUrl()}
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

        <DropdownMenuItem
          onClick={() => (window.location.href = cobalt.getLogoutUrl())}
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
