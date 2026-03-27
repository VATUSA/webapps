import FAQPageContent from "@/components/Support/FAQPageContent"
import { faqCategories } from "@/components/Support/faq-data"

const FALLBACK_TICKET_URL = "/support"

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
