import FAQPageContent from "@/components/Support/FAQ/FAQPageContent"
import { faqCategories } from "@/components/Support/FAQ/faq-data"
import { Metadata } from "next"

const FALLBACK_TICKET_URL = "/support"

export const metadata: Metadata = {
  title: "FAQ | VATUSA Support",
  description: "Frequently asked questions about VATUSA services",
}

export default function Page() {
  const supportTicketHref =
    process.env.NEXT_PUBLIC_SUPPORT_TICKET_URL ?? FALLBACK_TICKET_URL

  return (
    <FAQPageContent
      categories={faqCategories}
      supportTicketHref={supportTicketHref}
    />
  )
}
