"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  createEvent,
  cobaltRequest,
  getEventById,
  type CobaltEvent,
} from "@workspace/third-party/cobalt"

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

export async function createEventAction(formData: FormData) {
  const payload = buildEventPayload(formData)

  await createEvent(payload)

  const facilitySlug = parseFacilitySlug(payload.facility)
  revalidatePath(`/facility/${facilitySlug}/staff/events`)
  revalidatePath(`/facility/${facilitySlug}/staff`)
  redirect(`/facility/${facilitySlug}/staff/events`)
}

export async function updateEventAction(formData: FormData) {
  const eventId = readStringField(formData, "eventId")
  if (!eventId) throw new Error("Event ID is required.")

  const payload = buildEventPayload(formData)

  // If your backend uses a different method/path for event updates, adjust this one call.
  await cobaltRequest<unknown>(`event/${encodeURIComponent(eventId)}`, {
    method: "POST",
    body: payload,
  })

  const facilitySlug = parseFacilitySlug(payload.facility)
  revalidatePath(`/facility/${facilitySlug}/staff/events`)
  revalidatePath(`/facility/${facilitySlug}/staff`)
  redirect(`/facility/${facilitySlug}/staff/events`)
}
