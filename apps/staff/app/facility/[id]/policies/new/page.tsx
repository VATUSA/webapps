import { notFound } from "next/navigation"
import type { Metadata } from "next"
import PolicyDocumentForm from "@/components/Policies/PolicyDocumentForm"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"
import { fetchPoliciesForStaff } from "@/actions/policies"

export const metadata: Metadata = createStaffPageMetadata({
  title: "New Policy Document",
  description: "Add a new policy document.",
})

export default async function NewPolicyDocumentPage({
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

  if (facilityId !== "ZHQ") {
    notFound()
  }

  const categories = await fetchPoliciesForStaff()

  return (
    <div className="flex flex-1 flex-col gap-4">
      <PolicyDocumentForm mode="create" categories={categories} />
    </div>
  )
}
