import SupportTicketsPage from "@/components/Support/Tickets/SupportTicketsPage"
import { type Metadata } from "next"


export const metadata: Metadata = {
  title: "Support Tickets | VATUSA",
  description: "Create and manage your support tickets",
}

export default function Page() {
  return <SupportTicketsPage />
}
