"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  CobaltHttpError,
  cobaltRequest,
  getEventById,
  type CobaltEvent,
  type CobaltSession,
} from "@workspace/third-party/cobalt"
import { ACTION, OBJECT } from "@/lib/acl"
import {
  CobaltPermissionError,
  requireLivePermissionOrThrow,
} from "@/lib/auth"

export type EventActionState = {
  error: string | null
  success: string | null
  redirectTo?: string
}

function readStringField(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function toUtcIsoFromDateTimeLocal(value: string) {
  if (!value) return ""
  return new Date(`${value}:00Z`).toISOString()
}

function parseFacilitySlug(facility: string) {
  return facility.trim().toLowerCase()
}

function normalizeFacilityId(value: string) {
  return value.trim().toUpperCase()
}

function withEventDeletedFlag(path: string): string {
  const [pathname = "", query = ""] = path.split("?")
  const params = new URLSearchParams(query)
  params.set("eventDeleted", "1")
  const nextQuery = params.toString()

  return nextQuery ? `${pathname}?${nextQuery}` : pathname
}

function buildEventPayload(formData: FormData) {
  const title = readStringField(formData, "title")
  const body = readStringField(formData, "body")
  const facility = readStringField(formData, "facility").toUpperCase()
  const banner_image_url = readStringField(formData, "banner_image_url")
  const startLocal = readStringField(formData, "start_timestamp")
  const endLocal = readStringField(formData, "end_timestamp")

  if (!title) throw new Error("Event title is required.")
  if (!body) throw new Error("Event body is required.")
  if (!facility) throw new Error("Facility is required.")
  if (!startLocal) throw new Error("Start time is required.")
  if (!endLocal) throw new Error("End time is required.")

  const start_timestamp = toUtcIsoFromDateTimeLocal(startLocal)
  const end_timestamp = toUtcIsoFromDateTimeLocal(endLocal)

  if (!start_timestamp || !end_timestamp) {
    throw new Error("Invalid event timestamps.")
  }

  return {
    facility,
    title,
    body,
    banner_image_url: banner_image_url || undefined,
    start_timestamp,
    end_timestamp,
  }
}

async function getCobaltCookie() {
  const cookieStore = await cookies()
  return cookieStore.get("vatusa-cobalt-token")?.value
}

function getReadableErrorMessage(
  error: unknown,
  facilityId?: string,
  action?: "create" | "update" | "delete"
) {
  if (error instanceof CobaltPermissionError) {
    if (error.failureKind === "verification_failed") {
      return "Unable to verify permissions with Cobalt right now."
    }

    return facilityId
      ? buildLiveEventPermissionMessage(facilityId)
      : "You do not have live Cobalt permission to manage this event."
  }

  if (error instanceof CobaltHttpError && error.status === 403) {
    return facilityId
      ? buildEventEndpointRejectionMessage(action ?? "create", facilityId)
      : "Cobalt rejected this event action after live permission verification."
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }
  return "Something went wrong while saving the event."
}

function buildLiveEventPermissionMessage(facilityId: string) {
  return `You do not have live Cobalt permission to manage events for ${normalizeFacilityId(
    facilityId
  )}.`
}

function buildEventEndpointRejectionMessage(
  action: "create" | "update" | "delete",
  facilityId: string
) {
  const facility = normalizeFacilityId(facilityId)

  if (action === "update") {
    return `Cobalt rejected event updates for ${facility} after live permission verification.`
  }

  if (action === "delete") {
    return `Cobalt rejected event deletion for ${facility} after live permission verification.`
  }

  return `Cobalt rejected event creation for ${facility} after live permission verification.`
}

function logEventActionError(context: string, error: unknown) {
  console.error(`Event action failed (${context}):`, error)
}

function logEventEndpointDiscrepancy(input: {
  action: "create" | "update" | "delete"
  facilityId: string
  liveSession: CobaltSession
  error: CobaltHttpError
}) {
  console.error("Event endpoint rejected request after live permission preflight.", {
    action: input.action,
    facilityId: normalizeFacilityId(input.facilityId),
    cid: input.liveSession.user?.cid,
    preflightAllowed: true,
    status: input.error.status,
    statusText: input.error.statusText,
    url: input.error.url,
    body: input.error.body,
  })
}

export async function fetchEventForEdit(
  id: number | string
): Promise<CobaltEvent | null> {
  try {
    return await getEventById(id)
  } catch (error) {
    console.error(`Server error fetching event ${id}:`, error)
    return null
  }
}

export async function createEventAction(
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  let facilityIdForError = ""
  let liveSession: CobaltSession | undefined

  try {
    const payload = buildEventPayload(formData)
    facilityIdForError = payload.facility
    const cobaltCookie = await getCobaltCookie()
    if (!cobaltCookie) {
      return {
        error: "Missing Cobalt auth cookie.",
        success: null,
      }
    }

    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.event,
      action: ACTION.write,
      facilityId: payload.facility,
      message: buildLiveEventPermissionMessage(payload.facility),
    })

    await cobaltRequest<unknown>("event/create", {
      method: "POST",
      body: payload,
      cobaltCookie,
      credentials: "omit",
    })

    const facilitySlug = parseFacilitySlug(payload.facility)
    revalidatePath(`/facility/${facilitySlug}/events/manage`)
    revalidatePath(`/facility/${facilitySlug}/events/new`)
    revalidatePath(`/facility/${facilitySlug}`)

    return {
      error: null,
      success: "Event created successfully.",
      redirectTo: `/facility/${facilitySlug}/events/manage`,
    }
  } catch (error) {
    if (
      error instanceof CobaltHttpError &&
      error.status === 403 &&
      liveSession &&
      facilityIdForError
    ) {
      logEventEndpointDiscrepancy({
        action: "create",
        facilityId: facilityIdForError,
        liveSession,
        error,
      })
    }
    logEventActionError("create", error)
    return {
      error: getReadableErrorMessage(error, facilityIdForError, "create"),
      success: null,
    }
  }
}

export async function updateEventAction(
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  let facilityIdForError = ""
  let liveSession: CobaltSession | undefined

  try {
    const eventId = readStringField(formData, "eventId")
    if (!eventId) {
      return {
        error: "Event ID is required.",
        success: null,
      }
    }

    const submittedPayload = buildEventPayload(formData)
    facilityIdForError = submittedPayload.facility

    const cobaltCookie = await getCobaltCookie()

    if (!cobaltCookie) {
      return {
        error: "Missing Cobalt auth cookie.",
        success: null,
      }
    }

    const existingEvent = await getEventById(eventId)
    if (!existingEvent) {
      return {
        error: "Event not found.",
        success: null,
      }
    }

    const targetFacility = normalizeFacilityId(existingEvent.facility ?? "")
    facilityIdForError = targetFacility
    if (!targetFacility) {
      return {
        error: "Event facility is required.",
        success: null,
      }
    }

    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.event,
      action: ACTION.write,
      facilityId: targetFacility,
      message: buildLiveEventPermissionMessage(targetFacility),
    })

    const payload = {
      ...submittedPayload,
      facility: targetFacility,
    }

    await cobaltRequest<unknown>(`event/${encodeURIComponent(eventId)}`, {
      method: "POST",
      body: payload,
      cobaltCookie,
      credentials: "omit",
    })

    const facilitySlug = parseFacilitySlug(payload.facility)
    revalidatePath(`/facility/${facilitySlug}/events/manage`)
    revalidatePath(`/facility/${facilitySlug}/events/new`)
    revalidatePath(`/facility/${facilitySlug}`)

    return {
      error: null,
      success: "Event saved successfully.",
      redirectTo: `/facility/${facilitySlug}/events/manage`,
    }
  } catch (error) {
    if (
      error instanceof CobaltHttpError &&
      error.status === 403 &&
      liveSession &&
      facilityIdForError
    ) {
      logEventEndpointDiscrepancy({
        action: "update",
        facilityId: facilityIdForError,
        liveSession,
        error,
      })
    }
    logEventActionError("update", error)
    return {
      error: getReadableErrorMessage(error, facilityIdForError, "update"),
      success: null,
    }
  }
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  const eventId = readStringField(formData, "eventId")
  const requestedReturnTo = readStringField(formData, "returnTo")

  if (!eventId) {
    throw new Error("Event ID is required.")
  }

  const cobaltCookie = await getCobaltCookie()
  if (!cobaltCookie) {
    throw new Error("Missing Cobalt auth cookie.")
  }

  const existingEvent = await getEventById(eventId)
  if (!existingEvent) {
    throw new Error("Event not found.")
  }

  const targetFacility = normalizeFacilityId(existingEvent.facility ?? "")
  if (!targetFacility) {
    throw new Error("Event facility is required.")
  }

  const targetFacilitySlug = parseFacilitySlug(targetFacility)
  const returnTo: string =
    requestedReturnTo.length > 0
      ? requestedReturnTo
      : `/facility/${targetFacilitySlug}/events/manage`
  let liveSession: CobaltSession | undefined

  try {
    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.event,
      action: ACTION.write,
      facilityId: targetFacility,
      message: buildLiveEventPermissionMessage(targetFacility),
    })

    await cobaltRequest<unknown>(`event/${encodeURIComponent(eventId)}`, {
      method: "DELETE",
      cobaltCookie,
      credentials: "omit",
    })
  } catch (error) {
    if (
      error instanceof CobaltHttpError &&
      error.status === 403 &&
      liveSession
    ) {
      logEventEndpointDiscrepancy({
        action: "delete",
        facilityId: targetFacility,
        liveSession,
        error,
      })
    }
    logEventActionError("delete", error)
    throw new Error(getReadableErrorMessage(error, targetFacility, "delete"))
  }

  revalidatePath(`/facility/${targetFacilitySlug}/events/manage`)
  revalidatePath(`/facility/${targetFacilitySlug}/events/new`)
  revalidatePath(`/facility/${targetFacilitySlug}`)
  revalidatePath(`/facility/${targetFacilitySlug}/division/events`)
  revalidatePath(`/facility/zhq/division/events`)

  redirect(withEventDeletedFlag(returnTo))
}
