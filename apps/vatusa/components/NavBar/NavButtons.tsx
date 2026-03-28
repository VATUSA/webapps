"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu"
import {
  NAV_PRIMARY_LINKS,
  NAV_SECTIONS,
  type NavMenuItemEntry,
  type NavSection,
} from "@/components/NavBar/NavConfig"

export function NavButtons() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={
              <Link href={NAV_PRIMARY_LINKS.academy.href}>
                {NAV_PRIMARY_LINKS.academy.title}
              </Link>
            }
          />
        </NavigationMenuItem>

        {NAV_SECTIONS.map((section) => (
          <NavigationMenuItem key={section.id}>
            <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
            <NavigationMenuContent className="w-fit max-w-[min(90vw,42rem)]">
              <ul className={getSectionListClassName(section)}>
                {section.items.map((entry) =>
                  entry.type === "divider" ? (
                    <li
                      key={entry.key}
                      role="separator"
                      className="my-1 h-px bg-border"
                    />
                  ) : (
                    <ListItem key={`${section.id}-${entry.title}`} {...entry}>
                      {entry.description}
                    </ListItem>
                  )
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}

        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={
              <Link href={NAV_PRIMARY_LINKS.donate.href}>
                {NAV_PRIMARY_LINKS.donate.title}
              </Link>
            }
          />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function getSectionListClassName(section: NavSection) {
  if (section.id === "facilities") {
    return "inline-flex w-max max-h-[70vh] flex-col gap-0 overflow-y-auto whitespace-nowrap"
  }

  if (section.id === "division-info") {
    return "inline-flex w-max flex-col gap-1"
  }

  return "inline-flex w-max flex-col gap-0"
}


function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & NavMenuItemEntry) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link href={href} className="flex items-start gap-2">
            {Icon ? (
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            ) : null}
            <div className="flex flex-col gap-1 text-sm">
              <div className="leading-none font-medium">{title}</div>
              {children ? (
                <div className="line-clamp-2 text-muted-foreground">
                  {children}
                </div>
              ) : null}
            </div>
          </Link>
        }
      />
    </li>
  )
}
