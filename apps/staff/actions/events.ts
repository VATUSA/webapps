"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import {
  cobaltRequest,
  getEventById,
  type CobaltEvent,
} from "@workspace/third-party/cobalt"

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

function withEventDeletedFlag(path: string) {
  const [pathname, query = ""] = path.split("?")
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

function getReadableErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }
  return "Something went wrong while saving the event."
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
  try {
    const payload = buildEventPayload(formData)
    const cobaltCookie = await getCobaltCookie()

    if (!cobaltCookie) {
      return {
        error: "Missing Cobalt auth cookie.",
        success: null,
      }
    }

    await cobaltRequest<unknown>("event/create", {
      method: "POST",
      body: payload,
      cobaltCookie,
      credentials: "omit",
    })

    const facilitySlug = parseFacilitySlug(payload.facility)
    revalidatePath(`/facility/${facilitySlug}/staff/events`)
    revalidatePath(`/facility/${facilitySlug}/staff`)

    return {
      error: null,
      success: "Event created successfully.",
      redirectTo: `/facility/${facilitySlug}/staff/events`,
    }
  } catch (error) {
    return {
      error: getReadableErrorMessage(error),
      success: null,
    }
  }
}

export async function updateEventAction(
  _prevState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  try {
    const eventId = readStringField(formData, "eventId")
    if (!eventId) {
      return {
        error: "Event ID is required.",
        success: null,
      }
    }

    const payload = buildEventPayload(formData)
    const cobaltCookie = await getCobaltCookie()

    if (!cobaltCookie) {
      return {
        error: "Missing Cobalt auth cookie.",
        success: null,
      }
    }

    await cobaltRequest<unknown>(`event/${encodeURIComponent(eventId)}`, {
      method: "POST",
      body: payload,
      cobaltCookie,
      credentials: "omit",
    })

    const facilitySlug = parseFacilitySlug(payload.facility)
    revalidatePath(`/facility/${facilitySlug}/staff/events`)
    revalidatePath(`/facility/${facilitySlug}/staff`)

    return {
      error: null,
      success: "Event saved successfully.",
      redirectTo: `/facility/${facilitySlug}/staff/events`,
    }
  } catch (error) {
    return {
      error: getReadableErrorMessage(error),
      success: null,
    }
  }
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  const eventId = readStringField(formData, "eventId")
  const facilitySlug = parseFacilitySlug(readStringField(formData, "facilitySlug"))
  const returnTo =
    readStringField(formData, "returnTo") ||
    `/facility/${facilitySlug}/staff/events`

  if (!eventId) {
    throw new Error("Event ID is required.")
  }

  const cobaltCookie = await getCobaltCookie()
  if (!cobaltCookie) {
    throw new Error("Missing Cobalt auth cookie.")
  }

  await cobaltRequest<unknown>(`event/${encodeURIComponent(eventId)}`, {
    method: "DELETE",
    cobaltCookie,
    credentials: "omit",
  })

  revalidatePath(`/facility/${facilitySlug}/staff/events`)
  revalidatePath(`/facility/${facilitySlug}/staff`)
  revalidatePath(`/facility/${facilitySlug}/division/events`)
  revalidatePath(`/facility/usa/division/events`)

  const { redirect } = await import("next/navigation")
  redirect(withEventDeletedFlag(returnTo))
}

