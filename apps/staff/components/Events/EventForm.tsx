"use client"

import * as React from "react"
import { useActionState, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FormSaveButton } from "@/components/Form/FormSaveButton"
import { FormErrorToast } from "@/components/Form/FormErrorToast"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { SelectField } from "@workspace/ui/components/select-field"
import { type CobaltEvent } from "@workspace/third-party/cobalt"
import MarkdownEditor from "@/components/Editor/MarkdownEditor"
import {
  createEventAction,
  updateEventAction,
  type EventActionState,
} from "@/actions/events"
import { EVENT_FACILITY_OPTIONS } from "@/lib/facilities"

type EventFormProps = {
  mode: "create" | "edit"
  facilityId: string
  event?: CobaltEvent | null
}

const initialState: EventActionState = {
  error: null,
  success: null,
  redirectTo: undefined,
}

function toDateTimeLocal(value?: string) {
  if (!value) return ""

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  const pad = (n: number) => String(n).padStart(2, "0")

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
}

function normalizeFacility(value?: string) {
  return value?.trim().toUpperCase() ?? ""
}

// Kept in sync with the limits Cobalt enforces server-side; see
// storage.MaxBannerBytes and the accepted formats in storage/image.go.
const MAX_BANNER_BYTES = 8 * 1024 * 1024
const ACCEPTED_BANNER_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
]

export default function EventForm({ mode, facilityId, event }: EventFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const isZhqTeam = normalizeFacility(facilityId) === "ZHQ"

  const title = isEdit ? "Edit Event" : "Create Event"
  const description = isEdit
    ? "Update the event details for this facility."
    : isZhqTeam
      ? "Create a new event and choose which facility it belongs to."
      : "Create a new event for this facility."

  const action = isEdit ? updateEventAction : createEventAction
  const [state, formAction] = useActionState(action, initialState)

  const lastSuccessRef = React.useRef<string | null>(null)
  const [bannerError, setBannerError] = useState<string | null>(null)
  const existingBannerUrl = event?.banner_image_url ?? ""
  // Object URL for the newly-picked file, so the user sees what they're about
  // to upload. Null means "still showing whatever the event already had".
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!bannerPreview) return
    return () => URL.revokeObjectURL(bannerPreview)
  }, [bannerPreview])

  const handleBannerChange = useCallback(
    (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
      const file = changeEvent.target.files?.[0]

      setBannerPreview(null)

      if (!file) {
        setBannerError(null)
        return
      }
      if (file.size > MAX_BANNER_BYTES) {
        setBannerError(
          `Image must be ${MAX_BANNER_BYTES / (1024 * 1024)} MB or smaller.`
        )
        return
      }
      if (file.type && !ACCEPTED_BANNER_TYPES.includes(file.type)) {
        setBannerError("Image must be a PNG, JPG, GIF or WebP file.")
        return
      }

      const objectUrl = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          setBannerError("Could not read that image.")
          URL.revokeObjectURL(objectUrl)
          return
        }
        const ratio = img.naturalWidth / img.naturalHeight
        if (Math.abs(ratio - 16 / 9) > 0.02) {
          setBannerError(
            `Image must be 16:9 (detected ${img.naturalWidth}×${img.naturalHeight})`
          )
          URL.revokeObjectURL(objectUrl)
          return
        }
        setBannerError(null)
        setBannerPreview(objectUrl)
      }
      img.onerror = () => {
        setBannerError("Could not read that image.")
        URL.revokeObjectURL(objectUrl)
      }
      img.src = objectUrl
    },
    []
  )

  useEffect(() => {
    if (!state.success) {
      lastSuccessRef.current = null
      return
    }

    if (state.success !== lastSuccessRef.current) {
      lastSuccessRef.current = state.success

      toast.success(isEdit ? "Event saved" : "Event created", {
        description: state.success,
      })

      if (state.redirectTo) {
        router.push(state.redirectTo)
      }
    }
  }, [state.success, state.redirectTo, router, isEdit])

  const editFacility = normalizeFacility(event?.facility)
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent>
        <FormErrorToast
          error={state.error}
          title={isEdit ? "Failed to update event" : "Failed to create event"}
        />

        <form
          action={formAction}
          encType="multipart/form-data"
          onSubmit={(e) => {
            if (bannerError) e.preventDefault()
          }}
          className="space-y-5"
        >
          {isZhqTeam && !isEdit ? (
            <div className="space-y-2">
              <label htmlFor="facility" className="text-sm font-medium">
                Facility
              </label>
              <SelectField
                id="facility"
                name="facility"
                required
                defaultValue=""
                placeholder="Select a facility"
                options={EVENT_FACILITY_OPTIONS.map((facility) => ({
                  value: facility.code,
                  label: `${facility.code} - ${facility.name}`,
                }))}
              />
            </div>
          ) : (
            <input
              type="hidden"
              name="facility"
              value={isEdit ? editFacility : facilityId}
            />
          )}

          {isEdit && event ? (
            <input type="hidden" name="eventId" value={String(event.id)} />
          ) : null}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={event?.title ?? ""}
              placeholder="Enter event title"
            />
          </div>

          <MarkdownEditor
            name="body"
            label="Description"
            required
            defaultValue={event?.body ?? ""}
            placeholder="Write the event description"
          />

          {/* Carries the banner the event already has, so an edit that doesn't
              pick a new file keeps it. */}
          <input
            type="hidden"
            name="banner_image_url"
            value={existingBannerUrl}
          />

          <div className="space-y-2">
            <label htmlFor="banner_image" className="text-sm font-medium">
              Banner image
            </label>
            <Input
              id="banner_image"
              name="banner_image"
              type="file"
              accept={ACCEPTED_BANNER_TYPES.join(",")}
              required={!existingBannerUrl}
              onChange={handleBannerChange}
            />
            <p className="text-xs text-muted-foreground">
              {existingBannerUrl
                ? "Choose a file to replace the current banner, or leave empty to keep it."
                : "Required."}{" "}
              PNG, JPG, GIF or WebP, 16:9 aspect ratio (e.g. 1920×1080), up to{" "}
              {MAX_BANNER_BYTES / (1024 * 1024)} MB.
            </p>
            {bannerError && (
              <p className="text-sm text-destructive">{bannerError}</p>
            )}
            {(bannerPreview || existingBannerUrl) && !bannerError && (
              <div className="space-y-1 pt-1">
                <p className="text-xs text-muted-foreground">
                  {bannerPreview ? "New banner preview" : "Current banner"}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerPreview ?? existingBannerUrl}
                  alt="Event banner preview"
                  className="aspect-video w-full max-w-md rounded-md border border-border/60 object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="start_timestamp" className="text-sm font-medium">
                Start time (UTC)
              </label>
              <Input
                id="start_timestamp"
                name="start_timestamp"
                type="datetime-local"
                required
                defaultValue={toDateTimeLocal(event?.start_timestamp)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="end_timestamp" className="text-sm font-medium">
                End time (UTC)
              </label>
              <Input
                id="end_timestamp"
                name="end_timestamp"
                type="datetime-local"
                required
                defaultValue={toDateTimeLocal(event?.end_timestamp)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FormSaveButton>
              {isEdit ? "Save Changes" : "Create Event"}
            </FormSaveButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
