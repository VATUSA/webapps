// app/info/policies/page.tsx
import { type Metadata } from "next"
import PoliciesContent from "@/components/Policies/PoliciesContent"
import { fetchPolicies } from "@/actions/policies"
import { visibleCategoriesForDisplay } from "@/lib/policies"

export const metadata: Metadata = {
  title: "Policies & Documents | VATUSA",
  description: "VATUSA policies, guidelines, and official documents",
}

// Keep in sync with PUBLIC_REVALIDATE_SECONDS in @/lib/cache — Next.js
// requires this to be a statically analyzable literal.
export const revalidate = 300

export default async function Page() {
  const result = await fetchPolicies()
  const categories = visibleCategoriesForDisplay(result.categories)

  return <PoliciesContent categories={categories} loadFailed={!result.ok} />
}
