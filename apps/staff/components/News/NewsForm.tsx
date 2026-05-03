"use client"

import * as React from "react"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { FormErrorToast } from "@/components/Form/FormErrorToast"
import { FormSaveButton } from "@/components/Form/FormSaveButton"
import { type CobaltNewsItem } from "@workspace/third-party/cobalt"
import MarkdownEditor from "@/components/Editor/MarkdownEditor"
import {
  createNewsPostAction,
  updateNewsPostAction,
  type NewsActionState,
} from "@/actions/news"

type NewsFormProps = {
  mode: "create" | "edit"
  facilityId: string
  news?: CobaltNewsItem | null
}

const initialState: NewsActionState = {
  error: null,
  success: null,
  redirectTo: undefined,
}

export default function NewsForm({ mode, facilityId, news }: NewsFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const facilitySlug = facilityId.toLowerCase()
  const returnTo = `/facility/${facilitySlug}/news`
  const action = isEdit ? updateNewsPostAction : createNewsPostAction
  const [state, formAction] = useActionState(action, initialState)

  const lastSuccessRef = React.useRef<string | null>(null)

  useEffect(() => {
    if (!state.success) {
      lastSuccessRef.current = null
      return
    }

    if (state.success !== lastSuccessRef.current) {
      lastSuccessRef.current = state.success

      toast.success(isEdit ? "News saved" : "News created", {
        description: state.success,
      })

      if (state.redirectTo) {
        router.push(state.redirectTo)
      }
    }
  }, [state.success, state.redirectTo, router, isEdit])

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit News Post" : "Create News Post"}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {isEdit
            ? "Update this post in the shared Cobalt news feed."
            : "Publish a new post to the shared Cobalt news feed from this staff area."}
        </p>
      </CardHeader>

      <CardContent>
        <FormErrorToast
          error={state.error}
          title={
            isEdit ? "Failed to update news post" : "Failed to create news post"
          }
        />

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="facilitySlug" value={facilitySlug} />
          <input type="hidden" name="returnTo" value={returnTo} />

          {isEdit && news ? (
            <input type="hidden" name="newsId" value={String(news.id)} />
          ) : null}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={news?.title ?? ""}
              placeholder="Enter news title"
            />
          </div>

          <MarkdownEditor
            name="body"
            label="Body"
            required
            defaultValue={news?.body ?? ""}
            placeholder="Write the news post"
          />

          <div className="flex items-center gap-3">
            <FormSaveButton>
              {isEdit ? "Save Changes" : "Create Post"}
            </FormSaveButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
