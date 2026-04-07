"use client"

import * as React from "react"
import { useActionState } from "react"
import { FormSaveButton } from "@/components/Form/FormSaveButton"
import { FormErrorToast } from "@/components/Form/FormErrorToast"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { type CobaltEvent } from "@workspace/third-party/cobalt"
import {
  createEventAction,
  updateEventAction,
  type EventActionState,
} from "@/actions/events"

type EventFormProps = {
  mode: "create" | "edit"
  facilityId: string
  event?: CobaltEvent | null
}

const initialState: EventActionState = {
  error: null,
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

export default function EventForm({ mode, facilityId, event }: EventFormProps) {
  const isEdit = mode === "edit"
  const title = isEdit ? "Edit Event" : "Create Event"
  const description = isEdit
    ? "Update the event details for this facility."
    : "Create a new event for this facility."

  const action = isEdit ? updateEventAction : createEventAction
  const [state, formAction] = useActionState(action, initialState)

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

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="facility" value={facilityId} />
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

          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="body"
              name="body"
              required
              defaultValue={event?.body ?? ""}
              placeholder="Write the event description"
              className="min-h-40"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="banner_image_url" className="text-sm font-medium">
              Banner image URL
            </label>
            <Input
              id="banner_image_url"
              name="banner_image_url"
              type="url"
              defaultValue={event?.banner_image_url ?? ""}
              placeholder="https://..."
            />
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
