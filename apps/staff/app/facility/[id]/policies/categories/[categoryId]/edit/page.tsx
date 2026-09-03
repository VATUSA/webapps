import { notFound } from "next/navigation"
import type { Metadata } from "next"
import CategoryForm from "@/components/Policies/CategoryForm"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"
import { fetchPoliciesForStaff } from "@/actions/policies"

export const metadata: Metadata = createStaffPageMetadata({
  title: "Edit Policy Category",
  description: "Update an existing policy document category.",
})

type EditPolicyCategoryPageProps = {
  params: Promise<{ id: string; categoryId: string }>
}

export default async function EditPolicyCategoryPage({
  params,
}: EditPolicyCategoryPageProps) {
  const { id, categoryId } = await params
  const facilityId = id.trim().toUpperCase()
  const parsedCategoryId = Number(categoryId)

  if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
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
  const category = categories.find((c) => c.id === parsedCategoryId)

  if (!category) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <CategoryForm mode="edit" category={category} />
    </div>
  )
}
