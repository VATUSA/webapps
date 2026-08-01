"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import {
  CobaltHttpError,
  grantUserRole,
  revokeUserRole,
  searchUsers,
  type CobaltSession,
  type CobaltUserSearchResult,
} from "@workspace/third-party/cobalt"
import { ACTION, OBJECT } from "@/lib/acl"
import { CobaltPermissionError, requireLivePermissionOrThrow } from "@/lib/auth"

// ACE Team is a division-wide role, so it is always scoped to ZHQ.
const ACE_TEAM_FACILITY = "ZHQ"
const ACE_TEAM_ROLE = "ace_team"

const PERMISSION_MESSAGE =
  "You do not have live Cobalt permission to manage the ACE Team."

function readStringField(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function getReadableErrorMessage(error: unknown) {
  if (error instanceof CobaltPermissionError) {
    if (error.failureKind === "verification_failed") {
      return "Unable to verify permissions with Cobalt right now."
    }

    return PERMISSION_MESSAGE
  }

  if (error instanceof CobaltHttpError && error.status === 403) {
    return "Cobalt rejected this change after live permission verification."
  }

  if (error instanceof CobaltHttpError && error.status === 409) {
    return "That controller is already on the ACE Team."
  }

  if (error instanceof CobaltHttpError && error.status === 404) {
    return "No controller found with that CID."
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return "Something went wrong while updating the ACE Team."
}

export type AceCandidate = {
  cid: number
  name: string
  facility: string
}

function toCandidateName(user: CobaltUserSearchResult) {
  const displayName = user.division_user?.display_name?.trim()
  if (displayName) return displayName

  const networkName = [
    user.network_user?.first_name,
    user.network_user?.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim()

  return networkName || String(user.cid)
}

/**
 * Typeahead for the add box. Returns [] rather than throwing so the plain
 * add-by-CID flow keeps working when the running cobalt build predates
 * GET /user/search.
 */
export async function searchAceCandidatesAction(
  query: string
): Promise<AceCandidate[]> {
  const trimmed = query.trim()
  if (!trimmed) return []

  const cookieStore = await cookies()
  const cobaltCookie = cookieStore.get("vatusa-cobalt-token")?.value
  if (!cobaltCookie) return []

  try {
    const results = await searchUsers(trimmed, 8, cobaltCookie)

    return results.map((user) => ({
      cid: user.cid,
      name: toCandidateName(user),
      facility: user.division_user?.facility ?? "",
    }))
  } catch (error) {
    console.error("ACE candidate search failed:", error)
    return []
  }
}

export async function addAceTeamMemberAction(
  formData: FormData
): Promise<void> {
  const cid = readStringField(formData, "cid")
  if (!cid) {
    throw new Error("CID is required.")
  }
  if (!/^\d+$/.test(cid)) {
    throw new Error("Enter a numeric CID, or pick a controller from the list.")
  }

  const cookieStore = await cookies()
  const cobaltCookie = cookieStore.get("vatusa-cobalt-token")?.value
  if (!cobaltCookie) {
    throw new Error("Missing Cobalt auth cookie.")
  }

  let liveSession: CobaltSession | undefined

  try {
    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.divisionStaffRole,
      action: ACTION.write,
      facilityId: ACE_TEAM_FACILITY,
      message: PERMISSION_MESSAGE,
    })

    await grantUserRole(cid, ACE_TEAM_FACILITY, ACE_TEAM_ROLE, cobaltCookie)
  } catch (error) {
    if (
      error instanceof CobaltHttpError &&
      error.status === 403 &&
      liveSession
    ) {
      console.error(
        "Role endpoint rejected request after live permission preflight.",
        {
          action: "grant",
          role: ACE_TEAM_ROLE,
          facility: ACE_TEAM_FACILITY,
          cid,
          actorCid: liveSession.user?.cid,
          preflightAllowed: true,
          status: error.status,
          url: error.url,
          body: error.body,
        }
      )
    }

    console.error("ACE Team action failed (grant):", error)
    throw new Error(getReadableErrorMessage(error))
  }

  revalidatePath(`/facility/${ACE_TEAM_FACILITY.toLowerCase()}/events/ace-team`)
}

export async function removeAceTeamMemberAction(
  formData: FormData
): Promise<void> {
  const cid = readStringField(formData, "cid")
  if (!cid) {
    throw new Error("CID is required.")
  }

  const cookieStore = await cookies()
  const cobaltCookie = cookieStore.get("vatusa-cobalt-token")?.value
  if (!cobaltCookie) {
    throw new Error("Missing Cobalt auth cookie.")
  }

  let liveSession: CobaltSession | undefined

  try {
    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.divisionStaffRole,
      action: ACTION.write,
      facilityId: ACE_TEAM_FACILITY,
      message: PERMISSION_MESSAGE,
    })

    await revokeUserRole(cid, ACE_TEAM_FACILITY, ACE_TEAM_ROLE, cobaltCookie)
  } catch (error) {
    if (
      error instanceof CobaltHttpError &&
      error.status === 403 &&
      liveSession
    ) {
      console.error(
        "Role endpoint rejected request after live permission preflight.",
        {
          action: "revoke",
          role: ACE_TEAM_ROLE,
          facility: ACE_TEAM_FACILITY,
          cid,
          actorCid: liveSession.user?.cid,
          preflightAllowed: true,
          status: error.status,
          url: error.url,
          body: error.body,
        }
      )
    }

    console.error("ACE Team action failed (revoke):", error)
    throw new Error(getReadableErrorMessage(error))
  }

  revalidatePath(`/facility/${ACE_TEAM_FACILITY.toLowerCase()}/events/ace-team`)
}
