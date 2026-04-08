import { SupportTicket } from "@/components/Support/Tickets/types"

type TicketTableProps = {
  tickets: SupportTicket[]
  emptyText: string
}

function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function categoryLabel(value: SupportTicket["category"]): string {
  switch (value) {
    case "membership":
      return "Membership"
    case "training":
      return "Training"
    case "website":
      return "Website"
    case "facility":
      return "Facility"
    default:
      return "Other"
  }
}

export default function TicketTable({ tickets, emptyText }: TicketTableProps) {
  if (!tickets.length) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border/60">
      <table className="w-full min-w-[1100px] text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-2">Ticket ID</th>
            <th className="px-4 py-2">Subject</th>
            <th className="px-4 py-2">Facility</th>
            <th className="px-4 py-2">Assign To</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Created</th>
            <th className="px-4 py-2">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="group border-b border-border/50 transition-colors hover:[&>td]:bg-muted/50 dark:hover:[&>td]:bg-muted/80"
            >
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground transition-colors">
                {ticket.id}
              </td>
              <td className="px-4 py-3 transition-colors">
                <p className="font-medium text-foreground">{ticket.subject}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {ticket.description}
                </p>
              </td>
              <td className="px-4 py-3 text-muted-foreground transition-colors">
                {ticket.facility}
              </td>
              <td className="px-4 py-3 text-muted-foreground transition-colors">
                {ticket.assignedTo}
              </td>
              <td className="px-4 py-3 text-muted-foreground transition-colors">
                {categoryLabel(ticket.category)}
              </td>
              <td className="px-4 py-3 text-muted-foreground transition-colors">
                {formatDateTime(ticket.createdAt)}
              </td>
              <td className="px-4 py-3 text-muted-foreground transition-colors">
                {formatDateTime(ticket.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
