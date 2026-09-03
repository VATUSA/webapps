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
import type { CobaltPolicyCategory } from "@workspace/third-party/cobalt"
import {
  createPolicyCategoryAction,
  updatePolicyCategoryAction,
  type PolicyCategoryActionState,
} from "@/actions/policies"

type CategoryFormProps = {
  mode: "create" | "edit"
  category?: CobaltPolicyCategory | null
}

const initialState: PolicyCategoryActionState = {
  error: null,
  success: null,
  redirectTo: undefined,
}

export default function CategoryForm({ mode, category }: CategoryFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"

  const action = isEdit ? updatePolicyCategoryAction : createPolicyCategoryAction
  const [state, formAction] = useActionState(action, initialState)
  const lastSuccessRef = React.useRef<string | null>(null)

  useEffect(() => {
    if (!state.success) {
      lastSuccessRef.current = null
      return
    }

    if (state.success !== lastSuccessRef.current) {
      lastSuccessRef.current = state.success

      toast.success(isEdit ? "Category saved" : "Category created", {
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
        <CardTitle>{isEdit ? "Edit Category" : "New Category"}</CardTitle>
      </CardHeader>

      <CardContent>
        <FormErrorToast
          error={state.error}
          title={isEdit ? "Failed to update category" : "Failed to create category"}
        />

        <form action={formAction} className="space-y-5">
          {isEdit && category ? (
            <input
              type="hidden"
              name="categoryId"
              value={String(category.id)}
            />
          ) : null}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              required
              maxLength={120}
              defaultValue={category?.title ?? ""}
              placeholder="e.g. General Division"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sort_order" className="text-sm font-medium">
              Sort order
            </label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={category?.sort_order ?? 0}
            />
          </div>

          <div className="flex items-center gap-3">
            <FormSaveButton>
              {isEdit ? "Save Changes" : "Create Category"}
            </FormSaveButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
