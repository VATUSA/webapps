import { cookies } from "next/headers"
import {
  cobaltRequest,
  type CobaltSession,
} from "@workspace/third-party/cobalt"
import { getSession } from "@/lib/session"
import { hasAnyStaffAccess, hasScopedPermission } from "@/lib/acl"

const REFRESH_TTL_MS = 5 * 60 * 1000
const MAX_STALE_MS = 24 * 60 * 60 * 1000

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

async function syncSessionWithLiveCobalt(liveSession: CobaltSession) {
  const session = await getSession()
  session.cobalt = liveSession
  session.cobaltSyncedAt = Date.now()
  await saveSessionIfWritable(session)
}

export function requirePermissionOrThrow(input: {
  session: Awaited<ReturnType<typeof getSession>>
  object: string
  action?: string
  facilityId?: string
  requireFacility?: boolean
  allowGlobalFallback?: boolean
  message?: string
}) {
  const { session } = input
  const allowed = hasScopedPermission({
    globalPermissions: session.cobalt?.global_permissions ?? [],
    facilityPermissions: session.cobalt?.facility_permissions ?? [],
    object: input.object,
    action: input.action,
    facilityId: input.facilityId,
    requireFacility: input.requireFacility,
    allowGlobalFallback: input.allowGlobalFallback,
  })

  if (allowed) return

  const error = new Error(input.message ?? "Forbidden") as Error & {
    status?: number
  }
  error.status = 403
  throw error
}

function throwForbidden(message?: string): never {
  const error = new Error(message ?? "Forbidden") as Error & {
    status?: number
  }
  error.status = 403
  throw error
}

export async function requireLivePermissionOrThrow(input: {
  object: string
  action?: string
  facilityId?: string
  requireFacility?: boolean
  allowGlobalFallback?: boolean
  message?: string
}) {
  const cookieStore = await cookies()
  const cobaltCookie = cookieStore.get("vatusa-cobalt-token")?.value
  if (!cobaltCookie) {
    throwForbidden("Missing Cobalt auth cookie.")
  }

  let liveSession: CobaltSession
  try {
    liveSession = await cobaltRequest<CobaltSession>("my/session", {
      method: "GET",
      cobaltCookie,
      credentials: "omit",
    })
  } catch {
    throwForbidden("Unable to verify permissions with Cobalt.")
  }

  const allowed = hasScopedPermission({
    globalPermissions: liveSession.global_permissions ?? [],
    facilityPermissions: liveSession.facility_permissions ?? [],
    object: input.object,
    action: input.action,
    facilityId: input.facilityId,
    requireFacility: input.requireFacility,
    allowGlobalFallback: input.allowGlobalFallback,
  })

  if (!allowed) {
    // Keep session cookie ACLs in sync when live Cobalt denies the action.
    await syncSessionWithLiveCobalt(liveSession)
    throwForbidden(input.message)
  }
}

export async function requireStaffSession() {
  const session = await getSession()

  await refreshCobaltSessionIfStale(session)

  const isAuthed = session.isLoggedIn
  const allowed = hasAnyStaffAccess({
    globalPermissions: session.cobalt?.global_permissions ?? [],
    facilityPermissions: session.cobalt?.facility_permissions ?? [],
  })

  return { session, allowed: isAuthed && allowed }
}
