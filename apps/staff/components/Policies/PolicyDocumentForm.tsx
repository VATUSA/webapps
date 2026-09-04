"use client"

import * as React from "react"
import { useActionState, useEffect } from "react"
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
import { Textarea } from "@workspace/ui/components/textarea"
import { Switch } from "@workspace/ui/components/switch"
import { SelectField } from "@workspace/ui/components/select-field"
import type {
  CobaltPolicyCategory,
  CobaltPolicyDocument,
} from "@workspace/third-party/cobalt"
import {
  createPolicyDocumentAction,
  updatePolicyDocumentAction,
  type PolicyDocumentActionState,
} from "@/actions/policies"

type PolicyDocumentFormProps = {
  mode: "create" | "edit"
  categories: CobaltPolicyCategory[]
  document?: CobaltPolicyDocument | null
}

const initialState: PolicyDocumentActionState = {
  error: null,
  success: null,
  redirectTo: undefined,
}

// Kept in sync with the allowlist Cobalt enforces server-side; see
// storage.documentContentTypes in storage/document.go.
const MAX_DOCUMENT_BYTES = 50 * 1024 * 1024
const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".zip",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".txt",
  ".csv",
  ".md",
]

export default function PolicyDocumentForm({
  mode,
  categories,
  document,
}: PolicyDocumentFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"

  const title = isEdit ? "Edit Policy Document" : "New Policy Document"
  const description = isEdit
    ? "Update this document's details, category, or file."
    : "Add a new policy document and assign it to a category."

  const action = isEdit ? updatePolicyDocumentAction : createPolicyDocumentAction
  const [state, formAction] = useActionState(action, initialState)

  const lastSuccessRef = React.useRef<string | null>(null)
  const [fileError, setFileError] = React.useState<string | null>(null)
  const [hidden, setHidden] = React.useState(document?.hidden ?? false)
  const existingDocumentUrl = document?.document_url ?? ""

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      setFileError(null)
      return
    }
    if (file.size > MAX_DOCUMENT_BYTES) {
      setFileError(
        `File must be ${MAX_DOCUMENT_BYTES / (1024 * 1024)} MB or smaller.`
      )
      return
    }
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."))
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setFileError(
        `Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(", ")}`
      )
      return
    }
    setFileError(null)
  }

  useEffect(() => {
    if (!state.success) {
      lastSuccessRef.current = null
      return
    }

    if (state.success !== lastSuccessRef.current) {
      lastSuccessRef.current = state.success

      toast.success(isEdit ? "Document saved" : "Document created", {
        description: state.success,
      })

      if (state.redirectTo) {
        router.push(state.redirectTo)
      }
    }
  }, [state.success, state.redirectTo, router, isEdit])

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent>
        <FormErrorToast
          error={state.error}
          title={isEdit ? "Failed to update document" : "Failed to create document"}
        />

        <form
          action={formAction}
          encType="multipart/form-data"
          onSubmit={(e) => {
            if (fileError) e.preventDefault()
          }}
          className="space-y-5"
        >
          {isEdit && document ? (
            <input type="hidden" name="documentId" value={String(document.id)} />
          ) : null}

          <div className="space-y-2">
            <label htmlFor="policy_category_id" className="text-sm font-medium">
              Category
            </label>
            <SelectField
              id="policy_category_id"
              name="policy_category_id"
              required
              defaultValue={
                document ? String(document.policy_category_id) : ""
              }
              placeholder="Select a category"
              options={categories.map((category) => ({
                value: String(category.id),
                label: category.title,
              }))}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="ident" className="text-sm font-medium">
                Ident
              </label>
              <Input
                id="ident"
                name="ident"
                required
                maxLength={20}
                defaultValue={document?.ident ?? ""}
                placeholder="e.g. DP001"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="effective_date" className="text-sm font-medium">
                Effective date
              </label>
              <Input
                id="effective_date"
                name="effective_date"
                type="date"
                required
                defaultValue={document?.effective_date ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              required
              maxLength={255}
              defaultValue={document?.title ?? ""}
              placeholder="Enter document title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="summary" className="text-sm font-medium">
              Summary
            </label>
            <Textarea
              id="summary"
              name="summary"
              maxLength={500}
              defaultValue={document?.summary ?? ""}
              placeholder="Short description shown in the list"
            />
          </div>

          {/* Carries the file the document already has, so an edit that
              doesn't pick a new file keeps it. */}
          <input
            type="hidden"
            name="document_url"
            value={existingDocumentUrl}
          />

          <div className="space-y-2">
            <label htmlFor="document" className="text-sm font-medium">
              File
            </label>
            <Input
              id="document"
              name="document"
              type="file"
              accept={ACCEPTED_EXTENSIONS.join(",")}
              required={!existingDocumentUrl}
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground">
              {existingDocumentUrl
                ? "Choose a file to replace the current document, or leave empty to keep it."
                : "Required."}{" "}
              Up to {MAX_DOCUMENT_BYTES / (1024 * 1024)} MB.
            </p>
            {fileError && <p className="text-sm text-destructive">{fileError}</p>}
            {existingDocumentUrl && (
              <a
                href={existingDocumentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary underline underline-offset-2"
              >
                View current file
              </a>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Switch
                id="hidden-checkbox"
                checked={hidden}
                onCheckedChange={(checked) => setHidden(checked === true)}
              />
              <input type="hidden" name="hidden" value={String(hidden)} />
              <label htmlFor="hidden-checkbox" className="text-sm font-medium">
                Hidden (staff only)
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="sort_order" className="text-sm font-medium">
                Sort order
              </label>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={document?.sort_order ?? 0}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FormSaveButton>
              {isEdit ? "Save Changes" : "Create Document"}
            </FormSaveButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
