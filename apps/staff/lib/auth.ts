import { cookies } from "next/headers"
import {
  cobaltRequest,
  type CobaltSession,
} from "@workspace/third-party/cobalt"
import { getSession, type CobaltPermission } from "@/lib/session"

const REFRESH_TTL_MS = 5 * 60 * 1000
const MAX_STALE_MS = 24 * 60 * 60 * 1000

const STAFF_PERMISSION_OBJECTS = new Set([
  "superadmin",
  "system_api_role",
  "division_management_role",
  "division_staff_role",
  "facility_senior_staff_role",
  "facility_junior_staff_role",
  "facility_training_role",
  "news_post",
  "event",
  "user_sensitive_details",
])

async function saveSessionIfWritable(
  session: Awaited<ReturnType<typeof getSession>>
) {
  try {
    await session.save()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (
      message.includes(
        "Cookies can only be modified in a Server Action or Route Handler"
      )
    ) {
      return
    }

    throw error
  }
}

async function refreshCobaltSessionIfStale(
  session: Awaited<ReturnType<typeof getSession>>
) {
  const now = Date.now()
  const lastSync = session.cobaltSyncedAt ?? 0
  const age = now - lastSync
  const hasCobalt = !!session.cobalt

  if (hasCobalt && age < REFRESH_TTL_MS) return

  const cookieStore = await cookies()
  const cobaltCookie = cookieStore.get("vatusa-cobalt-token")?.value
  if (!cobaltCookie) return

  try {
    session.cobalt = await cobaltRequest<CobaltSession>("my/session", {
      method: "GET",
      cobaltCookie,
      credentials: "omit",
    })
    session.cobaltSyncedAt = now
    await saveSessionIfWritable(session)
  } catch {
    // Keep stale data briefly for resilience, but fail closed if too old.
    if (!hasCobalt || age > MAX_STALE_MS) {
      session.cobalt = undefined
      session.cobaltSyncedAt = undefined
      await saveSessionIfWritable(session)
    }
  }
}

function hasStaffAccess(perms: CobaltPermission[] | undefined): boolean {
  if (!Array.isArray(perms)) return false

  return perms.some(({ action, object }) => {
    const o = object?.toLowerCase()
    const a = action?.toLowerCase()

    if (o === "superadmin" && a === "usage") return true
    return STAFF_PERMISSION_OBJECTS.has(o ?? "")
  })
}

export async function requireStaffSession() {
  const session = await getSession()

  await refreshCobaltSessionIfStale(session)

  const isAuthed = session.isLoggedIn === true
  const allPermissions = [
    ...(session.cobalt?.global_permissions ?? []),
    ...(session.cobalt?.facility_permissions ?? []),
  ]
  const allowed = hasStaffAccess(allPermissions)


  return { session, allowed: isAuthed && allowed }
}
