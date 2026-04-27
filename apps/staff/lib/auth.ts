import { cookies } from "next/headers"
import {
  cobaltRequest,
  type CobaltSession,
} from "@workspace/third-party/cobalt"
import {
  hasAnyStaffAccess,
  hasScopedPermission,
  normalizePermissionCollections,
} from "@/lib/acl"

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
}) {
  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections(input.session)

  return hasScopedPermission({
    globalPermissions,
    facilityPermissions: allFacilityPermissions,
    object: input.object,
    action: input.action,
    facilityId: input.facilityId,
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
  message?: string
}): Promise<LivePermissionCheckResult> {
  const liveSessionResult = await getLiveCobaltSessionResult()

  if (liveSessionResult.ok) {
    const allowed = evaluatePermission({
      session: liveSessionResult.liveSession,
      object: input.object,
      action: input.action,
      facilityId: input.facilityId,
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
  })

  if (!allowed) {
    throwPermissionError(input.message ?? "Forbidden", "permission_denied")
  }

  return liveSessionResult.liveSession
}

export async function requireStaffAccess(): Promise<{
  allowed: boolean
  liveSession: CobaltSession | null
}> {
  const result = await getLiveCobaltSessionResult()
  if (!result.ok) return { allowed: false, liveSession: null }

  const { globalPermissions, allFacilityPermissions } =
    normalizePermissionCollections(result.liveSession)

  const allowed = hasAnyStaffAccess({
    globalPermissions,
    facilityPermissions: allFacilityPermissions,
  })

  return { allowed, liveSession: result.liveSession }
}
