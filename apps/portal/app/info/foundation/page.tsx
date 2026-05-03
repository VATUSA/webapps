import { type Metadata } from "next"
import FoundationPageContent from "@/components/Foundation/FoundationPageContent"

export const metadata: Metadata = {
  title: "Foundation | VATUSA",
  description:
    "Learn about VATUSA’s nonprofit mission, leadership, and how to support our work.",
}

export default function Page() {
  return <FoundationPageContent />
}
