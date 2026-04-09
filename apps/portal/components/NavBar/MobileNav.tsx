"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"
import {
  NAV_PRIMARY_LINKS,
  NAV_SECTIONS,
  type MenuIcon,
  type NavMenuEntry,
} from "@/components/NavBar/NavConfig"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({})

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  return (
    <>
      <button
        type="button"
        onClick={toggleMenu}
        className="rounded-md p-2 transition-colors hover:bg-accent md:hidden"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 transform border-r border-border bg-card text-card-foreground shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            type="button"
            onClick={closeMenu}
            className="rounded-md p-1 transition-colors hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="h-[calc(100vh-65px)] overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            <SidebarLink
              href={NAV_PRIMARY_LINKS.academy.href}
              title={NAV_PRIMARY_LINKS.academy.title}
              onClose={closeMenu}
            />

            {NAV_SECTIONS.map((section) => (
              <SidebarSection
                key={section.id}
                title={section.title}
                items={section.items}
                isExpanded={!!expandedSections[section.id]}
                onToggle={() => toggleSection(section.id)}
                onClose={closeMenu}
              />
            ))}

            <SidebarLink
              href={NAV_PRIMARY_LINKS.donate.href}
              title={NAV_PRIMARY_LINKS.donate.title}
              onClose={closeMenu}
            />
          </div>
        </nav>
      </aside>
    </>
  )
}

interface SidebarLinkProps {
  href: string
  title: string
  icon?: MenuIcon
  onClose: () => void
}

function SidebarLink({ href, title, icon: Icon, onClose }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
    >
      {Icon ? <Icon className="h-5 w-5" /> : null}
      <span>{title}</span>
    </Link>
  )
}

interface SidebarSectionProps {
  title: string
  items: NavMenuEntry[]
  isExpanded: boolean
  onToggle: () => void
  onClose: () => void
}

function SidebarSection({
  title,
  items,
  isExpanded,
  onToggle,
  onClose,
}: SidebarSectionProps) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded ? (
        <div className="space-y-1 bg-muted/50 px-2 py-2">
          {items.map((item) =>
            item.type === "divider" ? (
              <div
                key={item.key}
                className="my-2 h-px bg-border"
                role="separator"
              />
            ) : (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors hover:bg-accent"
              >
                {item.icon ? (
                  <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                ) : null}
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium text-foreground">
                    {item.title}
                  </span>
                  {item.description ? (
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  ) : null}
                </div>
              </Link>
            )
          )}
        </div>
      ) : null}
    </div>
  )
}
