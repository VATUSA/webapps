import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import PoliciesIndex from "@/components/Policies/PoliciesIndex"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"
import { fetchPoliciesForStaff } from "@/actions/policies"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Manage Policies",
  description: "Manage VATUSA policy documents and categories.",
})

export default async function PoliciesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const facilityId = id.trim().toUpperCase()

  const permissionCheck = await checkLivePermission({
    object: OBJECT.policy,
    action: ACTION.write,
    message: "You do not have live Cobalt permission to manage policies.",
  })

  if (!permissionCheck.allowed) {
    return (
      <UnauthorizedPanel
        message={permissionCheck.message}
        backHref={buildStaffHomeHref(facilityId)}
        toastMessage={permissionCheck.message}
      />
    )
  }

  // write:policy is global, not facility-scoped -- policies aren't a
  // per-facility resource, so this route only makes sense under ZHQ.
  if (facilityId !== "ZHQ") {
    notFound()
  }

  const categories = await fetchPoliciesForStaff()

  return (
    <div className="flex flex-1 flex-col gap-4">
      <PoliciesIndex categories={categories} />
    </div>
  )
}
