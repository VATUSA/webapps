import { SupportTicket } from "@/components/Support/Tickets/types"

export const mockTickets: SupportTicket[] = [
  {
    id: "TCK-2026-0001",
    subject: "Unable to access Academy quiz after completion",
    description:
      "I completed all required modules but the exam button remains disabled.",
    category: "training",
    status: "open",
    createdAt: "2026-03-20T15:04:00Z",
    updatedAt: "2026-03-24T18:12:00Z",
    requesterName: "You",
    facility: "VATUSA Headquarters",
    assignedTo: "Unassigned",
  },
  {
    id: "TCK-2026-0002",
    subject: "Transfer request button is not available",
    description:
      "I am trying to transfer facilities and do not see the transfer option in my profile.",
    category: "membership",
    status: "open",
    createdAt: "2026-03-18T20:40:00Z",
    updatedAt: "2026-03-19T01:05:00Z",
    requesterName: "You",
    facility: "VATUSA Headquarters",
    assignedTo: "Unassigned",
  },
  {
    id: "TCK-2026-0003",
    subject: "Typo on support FAQ page",
    description:
      "Found a typo in one of the Training Academy questions on the FAQ page.",
    category: "website",
    status: "closed",
    createdAt: "2026-03-07T11:30:00Z",
    updatedAt: "2026-03-08T09:10:00Z",
    requesterName: "You",
    facility: "VATUSA Headquarters",
    assignedTo: "Unassigned",
  },
  {
    id: "TCK-2026-0004",
    subject: "Facility roster appears outdated",
    description:
      "Members list for my ARTCC is missing recent changes and appears stale.",
    category: "facility",
    status: "closed",
    createdAt: "2026-02-22T14:00:00Z",
    updatedAt: "2026-02-24T07:42:00Z",
    requesterName: "You",
    facility: "Washington ARTCC (ZDC)",
    assignedTo: "Unassigned",
  },
]
