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
  title: "Edit Policy Document",
  description: "Update an existing policy document.",
})

type EditPolicyDocumentPageProps = {
  params: Promise<{ id: string; documentId: string }>
}

export default async function EditPolicyDocumentPage({
  params,
}: EditPolicyDocumentPageProps) {
  const { id, documentId } = await params
  const facilityId = id.trim().toUpperCase()
  const parsedDocumentId = Number(documentId)

  if (!Number.isInteger(parsedDocumentId) || parsedDocumentId <= 0) {
    notFound()
  }

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
  const document = categories
    .flatMap((category) => category.documents)
    .find((doc) => doc.id === parsedDocumentId)

  if (!document) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <PolicyDocumentForm mode="edit" categories={categories} document={document} />
    </div>
  )
}
