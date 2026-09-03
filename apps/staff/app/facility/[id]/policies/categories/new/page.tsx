import { notFound } from "next/navigation"
import type { Metadata } from "next"
import CategoryForm from "@/components/Policies/CategoryForm"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { createStaffPageMetadata } from "@/lib/metadata"
import { buildStaffHomeHref } from "@/lib/navigation"

export const metadata: Metadata = createStaffPageMetadata({
  title: "New Policy Category",
  description: "Create a new policy document category.",
})

export default async function NewPolicyCategoryPage({
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

  return (
    <div className="flex flex-1 flex-col gap-4">
      <CategoryForm mode="create" />
    </div>
  )
}
