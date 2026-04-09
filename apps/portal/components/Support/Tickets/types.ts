export type TicketStatus = "open" | "closed"

export type TicketCategory =
  | "membership"
  | "training"
  | "website"
  | "facility"
  | "other"

export type TicketFacility =
  | "VATUSA Headquarters"
  | "Albuquerque ARTCC (ZAB)"
  | "Washington ARTCC (ZDC)"
  | "Atlanta ARTCC (ZTL)"
  | "Chicago ARTCC (ZAU)"
  | "Los Angeles ARTCC (ZLA)"
  | "New York ARTCC (ZNY)"

export type TicketAssignee = "Unassigned" | "Support Team"

export type SupportTicket = {
  id: string
  subject: string
  description: string
  category: TicketCategory
  status: TicketStatus
  createdAt: string
  updatedAt: string
  requesterName: string
  facility: TicketFacility
  assignedTo: TicketAssignee
}

export type NewTicketInput = {
  subject: string
  description: string
  category: TicketCategory
  facility: TicketFacility
  assignedTo: TicketAssignee
}
