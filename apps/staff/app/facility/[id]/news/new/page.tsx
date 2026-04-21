import NewsForm from "@/components/News/NewsForm"
import { UnauthorizedPanel } from "@/components/Auth/UnauthorizedPanel"
import { ACTION, OBJECT } from "@/lib/acl"
import { checkLivePermission } from "@/lib/auth"
import { buildStaffHomeHref } from "@/lib/navigation"

export default async function NewNewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const permissionCheck = await checkLivePermission({
    object: OBJECT.newsPost,
    action: ACTION.write,
    allowGlobalFallback: false,
    message: "You do not have live Cobalt permission to publish global news posts.",
  })

  if (!permissionCheck.allowed) {
    return (
      <UnauthorizedPanel
        message={permissionCheck.message}
        backHref={buildStaffHomeHref(id)}
        toastMessage={permissionCheck.message}
      />
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <NewsForm mode="create" facilityId={id.toLowerCase()} />
    </main>
  )
}
