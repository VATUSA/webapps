// app/info/policies/page.tsx
import { type Metadata } from "next"
import PoliciesContent from "@/components/Policies/PoliciesContent"

export const metadata: Metadata = {
  title: "Policies & Documents | VATUSA",
  description: "VATUSA policies, guidelines, and official documents",
}

export default function Page() {
  return <PoliciesContent />
}
