"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  NewTicketInput,
  TicketAssignee,
  TicketFacility,
} from "@/components/Support/Tickets/types"

type NewTicketFormProps = {
  onCreateAction: (input: NewTicketInput) => void
}

const facilityOptions: TicketFacility[] = [
  "VATUSA Headquarters",
  "Albuquerque ARTCC (ZAB)",
  "Washington ARTCC (ZDC)",
  "Atlanta ARTCC (ZTL)",
  "Chicago ARTCC (ZAU)",
  "Los Angeles ARTCC (ZLA)",
  "New York ARTCC (ZNY)",
]

const assigneeOptions: TicketAssignee[] = ["Unassigned", "Support Team"]

type FormSubmitEvent = Parameters<
  NonNullable<React.ComponentProps<"form">["onSubmit"]>
>[0]

export default function NewTicketForm({ onCreateAction }: NewTicketFormProps) {
  const [subject, setSubject] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [facility, setFacility] = React.useState<TicketFacility>(
    "VATUSA Headquarters"
  )
  const [assignedTo, setAssignedTo] =
    React.useState<TicketAssignee>("Unassigned")

  const canSubmit =
    subject.trim().length >= 6 && description.trim().length >= 12

  const handleSubmit = (event: FormSubmitEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    onCreateAction({
      subject: subject.trim(),
      description: description.trim(),
      // Category is hidden in UI now; keep a stable default for mock data.
      category: "other",
      facility,
      assignedTo,
    })

    setSubject("")
    setDescription("")
    setFacility("VATUSA Headquarters")
    setAssignedTo("Unassigned")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Open Support Ticket
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Most common questions have already been answered in our FAQ. Have you
          looked at our Knowledgebase for an answer already? You&apos;re more
          likely to get your answer much more quickly by consulting the FAQ.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="ticket-subject"
          className="text-sm font-medium text-foreground"
        >
          Subject
        </label>
        <Input
          id="ticket-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ticket Subject"
          maxLength={120}
          required
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="ticket-facility"
            className="text-sm font-medium text-foreground"
          >
            Facility
          </label>
          <select
            id="ticket-facility"
            value={facility}
            onChange={(e) => setFacility(e.target.value as TicketFacility)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            {facilityOptions.map((option) => (
              <option key={option} value={option} className="bg-background">
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="ticket-assigned"
            className="text-sm font-medium text-foreground"
          >
            Assign To
          </label>
          <select
            id="ticket-assigned"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value as TicketAssignee)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            {assigneeOptions.map((option) => (
              <option key={option} value={option} className="bg-background">
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="ticket-message"
          className="text-sm font-medium text-foreground"
        >
          Message
        </label>
        <Textarea
          id="ticket-message"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ticket Message"
          className="min-h-32"
          required
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/support/faq"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          ... or check the Knowledgebase
        </Link>

        <Button type="submit" disabled={!canSubmit}>
          Open Ticket
        </Button>
      </div>
    </form>
  )
}
