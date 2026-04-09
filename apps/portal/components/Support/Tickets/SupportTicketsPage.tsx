"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import {
  NewTicketInput,
  SupportTicket,
} from "@/components/Support/Tickets/types"
import { mockTickets } from "@/components/Support/Tickets/MockTickets"
import NewTicketForm from "@/components/Support/Tickets/NewTicketForm"
import TicketTable from "@/components/Support/Tickets/TicketTable"

const STORAGE_KEY = "portal-support-tickets:v1"

function buildTicketId(existing: SupportTicket[]): string {
  const maxSeq = existing.reduce((max, ticket) => {
    const match = ticket.id.match(/(\d+)$/)
    const value = match ? Number(match[1]) : 0
    return Math.max(max, value)
  }, 0)

  return `TCK-${new Date().getFullYear()}-${String(maxSeq + 1).padStart(4, "0")}`
}

type ViewMode = "open" | "closed"

export default function SupportTicketsPage() {
  const [tickets, setTickets] = React.useState<SupportTicket[]>(mockTickets)
  const [viewMode, setViewMode] = React.useState<ViewMode>("open")
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setTickets(parsed as SupportTicket[])
      }
    } catch (error) {
      console.error("Failed to load local tickets:", error)
    }
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  }, [tickets])

  const openCount = tickets.filter((t) => t.status === "open").length
  const closedCount = tickets.filter((t) => t.status === "closed").length

  const visibleTickets = React.useMemo(() => {
    const normalized = query.trim().toLowerCase()

    return tickets
      .filter((ticket) => ticket.status === viewMode)
      .filter((ticket) => {
        if (!normalized) return true
        return (
          ticket.id.toLowerCase().includes(normalized) ||
          ticket.subject.toLowerCase().includes(normalized) ||
          ticket.description.toLowerCase().includes(normalized) ||
          ticket.category.toLowerCase().includes(normalized) ||
          ticket.facility.toLowerCase().includes(normalized)
        )
      })
      .sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime()
        const bTime = new Date(b.updatedAt).getTime()
        return bTime - aTime
      })
  }, [tickets, viewMode, query])

  const handleCreateTicket = (input: NewTicketInput) => {
    const now = new Date().toISOString()
    const newTicket: SupportTicket = {
      id: buildTicketId(tickets),
      subject: input.subject,
      description: input.description,
      category: input.category,
      status: "open",
      createdAt: now,
      updatedAt: now,
      requesterName: "You",
      facility: input.facility,
      assignedTo: input.assignedTo,
    }

    setTickets((prev) => [newTicket, ...prev])
    setViewMode("open")
    toast.success("Ticket opened", {
      description: `${newTicket.id} has been added to your open tickets.`,
    })
  }

  return (
    <main className="container mx-auto py-6">
      <section className="mb-6 rounded-xl border border-border/60 bg-card/95 p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Support
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Support Tickets
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Open a new support request or review your existing tickets.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Need quick help first? Check{" "}
          <Link
            href="/support/faq"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Support / FAQ
          </Link>
          .
        </p>
      </section>

      <Card className="mb-4 border-border/60 bg-card/95">
        <CardContent className="pt-6">
          <NewTicketForm onCreateAction={handleCreateTicket} />
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/95">
        <CardHeader className="gap-3">
          <CardTitle>Your Tickets</CardTitle>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={viewMode === "open" ? "default" : "ghost"}
              className={cn(viewMode !== "open" && "text-muted-foreground")}
              onClick={() => setViewMode("open")}
            >
              Open ({openCount})
            </Button>
            <Button
              type="button"
              variant={viewMode === "closed" ? "default" : "ghost"}
              className={cn(viewMode !== "closed" && "text-muted-foreground")}
              onClick={() => setViewMode("closed")}
            >
              Closed ({closedCount})
            </Button>
          </div>

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ticket ID, subject, facility, or category..."
          />
        </CardHeader>

        <CardContent>
          <TicketTable
            tickets={visibleTickets}
            emptyText={
              viewMode === "open"
                ? "You do not have any open tickets."
                : "You do not have any closed tickets."
            }
          />
        </CardContent>
      </Card>
    </main>
  )
}
