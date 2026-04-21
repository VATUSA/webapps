import { cookies } from "next/headers"
import {
  cobaltRequest,
  type CobaltSession,
} from "@workspace/third-party/cobalt"
import { getSession } from "@/lib/session"
import {
  hasAnyStaffAccess,
  hasScopedPermission,
  normalizePermissionCollections,
} from "@/lib/acl"

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

type LiveSessionResult =
  | { ok: true; liveSession: CobaltSession }
  | { ok: false; message: string }

export type LivePermissionCheckResult = {
  allowed: boolean
  message: string
  liveSession?: CobaltSession
  source: "live"
  failureKind?: "permission_denied" | "verification_failed"
}

export class CobaltPermissionError extends Error {
  status: number
  failureKind: "permission_denied" | "verification_failed"

  constructor(input: {
    message: string
    failureKind: "permission_denied" | "verification_failed"
  }) {
    super(input.message)
    this.name = "CobaltPermissionError"
    this.status = 403
    this.failureKind = input.failureKind
  }
}

function evaluatePermission(input: {
  session?: Pick<CobaltSession, "global_permissions" | "facility_permissions"> | null
  object: string
  action?: string
  facilityId?: string
  requireFacility?: boolean
  allowGlobalFallback?: boolean
  allowSuperAdmin?: boolean
}) {
  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections(input.session)

  return hasScopedPermission({
    globalPermissions,
    facilityPermissions: allFacilityPermissions,
    object: input.object,
    action: input.action,
    facilityId: input.facilityId,
    requireFacility: input.requireFacility,
    allowGlobalFallback: input.allowGlobalFallback,
    allowSuperAdmin: input.allowSuperAdmin,
  })
}

async function getLiveCobaltSessionResult(): Promise<LiveSessionResult> {
  const cookieStore = await cookies()
  const cobaltCookie = cookieStore.get("vatusa-cobalt-token")?.value
  if (!cobaltCookie) {
    return {
      ok: false,
      message: "Missing Cobalt auth cookie.",
    }
  }

  try {
    const liveSession = await cobaltRequest<CobaltSession>("my/session", {
      method: "GET",
      cobaltCookie,
      credentials: "omit",
    })
    await syncSessionWithLiveCobalt(liveSession)
    return { ok: true, liveSession }
  } catch {
    return {
      ok: false,
      message: "Unable to verify permissions with Cobalt right now.",
    }
  }
}

export async function getLiveCobaltSessionOrThrow(): Promise<CobaltSession> {
  const result = await getLiveCobaltSessionResult()
  if (result.ok) {
    return result.liveSession
  }

  throwPermissionError(result.message, "verification_failed")
}

export function requirePermissionOrThrow(input: {
  session: Awaited<ReturnType<typeof getSession>>
  object: string
  action?: string
  facilityId?: string
  requireFacility?: boolean
  allowGlobalFallback?: boolean
  allowSuperAdmin?: boolean
  message?: string
}) {
  const { session } = input
  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections(session.cobalt)
  const allowed = hasScopedPermission({
    globalPermissions,
    facilityPermissions: allFacilityPermissions,
    object: input.object,
    action: input.action,
    facilityId: input.facilityId,
    requireFacility: input.requireFacility,
    allowGlobalFallback: input.allowGlobalFallback,
    allowSuperAdmin: input.allowSuperAdmin,
  })

  if (allowed) return

  throwPermissionError(input.message ?? "Forbidden", "permission_denied")
}

function throwPermissionError(
  message: string,
  failureKind: "permission_denied" | "verification_failed"
): never {
  throw new CobaltPermissionError({
    message,
    failureKind,
  })
}

export async function checkLivePermission(input: {
  object: string
  action?: string
  facilityId?: string
  requireFacility?: boolean
  allowGlobalFallback?: boolean
  allowSuperAdmin?: boolean
  message?: string
}): Promise<LivePermissionCheckResult> {
  const liveSessionResult = await getLiveCobaltSessionResult()

  if (liveSessionResult.ok) {
    const allowed = evaluatePermission({
      session: liveSessionResult.liveSession,
      object: input.object,
      action: input.action,
      facilityId: input.facilityId,
      requireFacility: input.requireFacility,
      allowGlobalFallback: input.allowGlobalFallback,
      allowSuperAdmin: input.allowSuperAdmin,
    })

    return {
      allowed,
      message: allowed ? "" : (input.message ?? "Forbidden"),
      liveSession: liveSessionResult.liveSession,
      source: "live",
      failureKind: allowed ? undefined : "permission_denied",
    }
  }

  return {
    allowed: false,
    message: liveSessionResult.message,
    source: "live",
    failureKind: "verification_failed",
  }
}

export async function requireLivePermissionOrThrow(input: {
  object: string
  action?: string
  facilityId?: string
  requireFacility?: boolean
  allowGlobalFallback?: boolean
  allowSuperAdmin?: boolean
  message?: string
}): Promise<CobaltSession> {
  const liveSessionResult = await getLiveCobaltSessionResult()
  if (!liveSessionResult.ok) {
    throwPermissionError(liveSessionResult.message, "verification_failed")
  }

  const allowed = evaluatePermission({
    session: liveSessionResult.liveSession,
    object: input.object,
    action: input.action,
    facilityId: input.facilityId,
    requireFacility: input.requireFacility,
    allowGlobalFallback: input.allowGlobalFallback,
    allowSuperAdmin: input.allowSuperAdmin,
  })

  if (!allowed) {
    throwPermissionError(input.message ?? "Forbidden", "permission_denied")
  }

  return liveSessionResult.liveSession
}

export async function requireStaffSession() {
  const session = await getSession()

  await refreshCobaltSessionIfStale(session)
  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections(session.cobalt)

  const isAuthed = session.isLoggedIn
  const allowed = hasAnyStaffAccess({
    globalPermissions,
    facilityPermissions: allFacilityPermissions,
  })

  return { session, allowed: isAuthed && allowed }
}
