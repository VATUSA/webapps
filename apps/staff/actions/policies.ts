"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  CobaltHttpError,
  cobaltRequest,
  getPolicies,
  type CobaltPolicyCategory,
  type CobaltPolicyDocument,
  type CobaltSession,
} from "@workspace/third-party/cobalt"
import { ACTION, OBJECT } from "@/lib/acl"
import {
  CobaltPermissionError,
  requireLivePermissionOrThrow,
} from "@/lib/auth"
import { withNotice } from "@/lib/notice"

export type PolicyDocumentActionState = {
  error: string | null
  success: string | null
  redirectTo?: string
}

export type PolicyCategoryActionState = {
  error: string | null
  success: string | null
  redirectTo?: string
}

const POLICIES_BASE_PATH = "/facility/zhq/policies"
const POLICIES_NEW_PATH = `${POLICIES_BASE_PATH}/new`
const POLICIES_CATEGORIES_PATH = `${POLICIES_BASE_PATH}/categories`

function readStringField(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

async function getCobaltCookie() {
  const cookieStore = await cookies()
  return cookieStore.get("vatusa-cobalt-token")?.value
}

function getReadableErrorMessage(
  error: unknown,
  action: "create" | "update" | "delete" = "create"
) {
  if (error instanceof CobaltPermissionError) {
    if (error.failureKind === "verification_failed") {
      return "Unable to verify permissions with Cobalt right now."
    }
    return "You do not have live Cobalt permission to manage policies."
  }

  if (error instanceof CobaltHttpError) {
    if (error.status === 403) {
      return `Cobalt rejected the policy ${action} after live permission verification.`
    }
    if (error.status === 409) {
      return "That category still has documents in it and can't be deleted."
    }
    if (error.status === 400) {
      const body =
        typeof error.body === "object" && error.body
          ? (error.body as { message?: string; error?: string })
          : undefined
      return body?.message ?? body?.error ?? error.message
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return "Something went wrong while saving."
}

function logPolicyActionError(context: string, error: unknown) {
  console.error(`Policy action failed (${context}):`, error)
}

function logPolicyEndpointDiscrepancy(input: {
  action: "create" | "update" | "delete"
  liveSession: CobaltSession
  error: CobaltHttpError
}) {
  console.error(
    "Policy endpoint rejected request after live permission preflight.",
    {
      action: input.action,
      cid: input.liveSession.user?.cid,
      preflightAllowed: true,
      status: input.error.status,
      statusText: input.error.statusText,
      url: input.error.url,
      body: input.error.body,
    }
  )
}

function revalidatePolicyPaths() {
  revalidatePath(POLICIES_BASE_PATH)
  revalidatePath(POLICIES_NEW_PATH)
  revalidatePath(POLICIES_CATEGORIES_PATH)
}

/**
 * Fetches the full category/document tree with the caller's Cobalt cookie so
 * hidden documents come back too -- there is no GET /policy/document/:id, so
 * an edit page has to find its document in this tree by id.
 */
export async function fetchPoliciesForStaff(): Promise<CobaltPolicyCategory[]> {
  const cobaltCookie = await getCobaltCookie()
  try {
    return await getPolicies(cobaltCookie)
  } catch (error) {
    console.error("Server error fetching policies for staff:", error)
    return []
  }
}

export async function fetchPolicyDocumentForEdit(
  documentId: number
): Promise<CobaltPolicyDocument | null> {
  const categories = await fetchPoliciesForStaff()
  for (const category of categories) {
    const found = category.documents.find((doc) => doc.id === documentId)
    if (found) return found
  }
  return null
}

function buildDocumentPayload(formData: FormData): FormData {
  const categoryId = readStringField(formData, "policy_category_id")
  const ident = readStringField(formData, "ident")
  const title = readStringField(formData, "title")
  const summary = readStringField(formData, "summary")
  const existingUrl = readStringField(formData, "document_url")
  const effectiveDate = readStringField(formData, "effective_date")
  const hidden = readStringField(formData, "hidden") === "true"
  const sortOrder = readStringField(formData, "sort_order") || "0"
  const file = formData.get("document")

  if (!categoryId) throw new Error("Category is required.")
  if (!ident) throw new Error("Ident is required.")
  if (!title) throw new Error("Title is required.")
  if (!effectiveDate) throw new Error("Effective date is required.")

  const hasFile = file instanceof File && file.size > 0
  if (!hasFile && !existingUrl) {
    throw new Error("A document file is required.")
  }

  const payload = new FormData()
  payload.set("policy_category_id", categoryId)
  payload.set("ident", ident)
  payload.set("title", title)
  payload.set("summary", summary)
  payload.set("document_url", existingUrl)
  payload.set("effective_date", effectiveDate)
  payload.set("hidden", String(hidden))
  payload.set("sort_order", sortOrder)
  if (hasFile) {
    payload.set("document", file, file.name)
  }

  return payload
}

export async function createPolicyDocumentAction(
  _prevState: PolicyDocumentActionState,
  formData: FormData
): Promise<PolicyDocumentActionState> {
  let liveSession: CobaltSession | undefined

  try {
    const payload = buildDocumentPayload(formData)

    const cobaltCookie = await getCobaltCookie()
    if (!cobaltCookie) {
      return { error: "Missing Cobalt auth cookie.", success: null }
    }

    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.policy,
      action: ACTION.write,
      message: "You do not have live Cobalt permission to manage policies.",
    })

    await cobaltRequest<unknown>("policy/document", {
      method: "POST",
      body: payload,
      cobaltCookie,
      credentials: "omit",
    })

    revalidatePolicyPaths()

    return {
      error: null,
      success: "Policy document created successfully.",
      redirectTo: POLICIES_BASE_PATH,
    }
  } catch (error) {
    if (error instanceof CobaltHttpError && error.status === 403 && liveSession) {
      logPolicyEndpointDiscrepancy({ action: "create", liveSession, error })
    }
    logPolicyActionError("create document", error)
    return { error: getReadableErrorMessage(error, "create"), success: null }
  }
}

export async function updatePolicyDocumentAction(
  _prevState: PolicyDocumentActionState,
  formData: FormData
): Promise<PolicyDocumentActionState> {
  let liveSession: CobaltSession | undefined

  try {
    const documentId = readStringField(formData, "documentId")
    if (!documentId) {
      return { error: "Document ID is required.", success: null }
    }

    const payload = buildDocumentPayload(formData)

    const cobaltCookie = await getCobaltCookie()
    if (!cobaltCookie) {
      return { error: "Missing Cobalt auth cookie.", success: null }
    }

    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.policy,
      action: ACTION.write,
      message: "You do not have live Cobalt permission to manage policies.",
    })

    await cobaltRequest<unknown>(
      `policy/document/${encodeURIComponent(documentId)}`,
      {
        method: "POST",
        body: payload,
        cobaltCookie,
        credentials: "omit",
      }
    )

    revalidatePolicyPaths()
    revalidatePath(`${POLICIES_BASE_PATH}/${documentId}/edit`)

    return {
      error: null,
      success: "Policy document saved successfully.",
      redirectTo: POLICIES_BASE_PATH,
    }
  } catch (error) {
    if (error instanceof CobaltHttpError && error.status === 403 && liveSession) {
      logPolicyEndpointDiscrepancy({ action: "update", liveSession, error })
    }
    logPolicyActionError("update document", error)
    return { error: getReadableErrorMessage(error, "update"), success: null }
  }
}

export async function deletePolicyDocumentAction(
  formData: FormData
): Promise<void> {
  const documentId = readStringField(formData, "documentId")
  const returnTo = readStringField(formData, "returnTo") || POLICIES_BASE_PATH

  if (!documentId) {
    throw new Error("Document ID is required.")
  }

  const cobaltCookie = await getCobaltCookie()
  if (!cobaltCookie) {
    throw new Error("Missing Cobalt auth cookie.")
  }

  let liveSession: CobaltSession | undefined

  try {
    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.policy,
      action: ACTION.write,
      message: "You do not have live Cobalt permission to manage policies.",
    })

    await cobaltRequest<unknown>(
      `policy/document/${encodeURIComponent(documentId)}`,
      { method: "DELETE", cobaltCookie, credentials: "omit" }
    )
  } catch (error) {
    if (error instanceof CobaltHttpError && error.status === 403 && liveSession) {
      logPolicyEndpointDiscrepancy({ action: "delete", liveSession, error })
    }
    logPolicyActionError("delete document", error)
    redirect(
      withNotice(returnTo, "error", getReadableErrorMessage(error, "delete"))
    )
  }

  revalidatePolicyPaths()
  redirect(withNotice(returnTo, "success", "Policy document deleted."))
}

function buildCategoryPayload(formData: FormData) {
  const title = readStringField(formData, "title")
  const sortOrder = Number(readStringField(formData, "sort_order") || "0")

  if (!title) throw new Error("Category title is required.")

  return { title, sort_order: Number.isFinite(sortOrder) ? sortOrder : 0 }
}

export async function createPolicyCategoryAction(
  _prevState: PolicyCategoryActionState,
  formData: FormData
): Promise<PolicyCategoryActionState> {
  let liveSession: CobaltSession | undefined

  try {
    const payload = buildCategoryPayload(formData)

    const cobaltCookie = await getCobaltCookie()
    if (!cobaltCookie) {
      return { error: "Missing Cobalt auth cookie.", success: null }
    }

    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.policy,
      action: ACTION.write,
      message: "You do not have live Cobalt permission to manage policies.",
    })

    await cobaltRequest<unknown>("policy/category", {
      method: "POST",
      body: payload,
      cobaltCookie,
      credentials: "omit",
    })

    revalidatePolicyPaths()

    return {
      error: null,
      success: "Category created successfully.",
      redirectTo: POLICIES_CATEGORIES_PATH,
    }
  } catch (error) {
    if (error instanceof CobaltHttpError && error.status === 403 && liveSession) {
      logPolicyEndpointDiscrepancy({ action: "create", liveSession, error })
    }
    logPolicyActionError("create category", error)
    return { error: getReadableErrorMessage(error, "create"), success: null }
  }
}

export async function updatePolicyCategoryAction(
  _prevState: PolicyCategoryActionState,
  formData: FormData
): Promise<PolicyCategoryActionState> {
  let liveSession: CobaltSession | undefined

  try {
    const categoryId = readStringField(formData, "categoryId")
    if (!categoryId) {
      return { error: "Category ID is required.", success: null }
    }

    const payload = buildCategoryPayload(formData)

    const cobaltCookie = await getCobaltCookie()
    if (!cobaltCookie) {
      return { error: "Missing Cobalt auth cookie.", success: null }
    }

    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.policy,
      action: ACTION.write,
      message: "You do not have live Cobalt permission to manage policies.",
    })

    await cobaltRequest<unknown>(
      `policy/category/${encodeURIComponent(categoryId)}`,
      {
        method: "POST",
        body: payload,
        cobaltCookie,
        credentials: "omit",
      }
    )

    revalidatePolicyPaths()
    revalidatePath(`${POLICIES_CATEGORIES_PATH}/${categoryId}/edit`)

    return {
      error: null,
      success: "Category saved successfully.",
      redirectTo: POLICIES_CATEGORIES_PATH,
    }
  } catch (error) {
    if (error instanceof CobaltHttpError && error.status === 403 && liveSession) {
      logPolicyEndpointDiscrepancy({ action: "update", liveSession, error })
    }
    logPolicyActionError("update category", error)
    return { error: getReadableErrorMessage(error, "update"), success: null }
  }
}

export async function deletePolicyCategoryAction(
  formData: FormData
): Promise<void> {
  const categoryId = readStringField(formData, "categoryId")
  const returnTo =
    readStringField(formData, "returnTo") || POLICIES_CATEGORIES_PATH

  if (!categoryId) {
    throw new Error("Category ID is required.")
  }

  const cobaltCookie = await getCobaltCookie()
  if (!cobaltCookie) {
    throw new Error("Missing Cobalt auth cookie.")
  }

  let liveSession: CobaltSession | undefined

  try {
    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.policy,
      action: ACTION.write,
      message: "You do not have live Cobalt permission to manage policies.",
    })

    await cobaltRequest<unknown>(
      `policy/category/${encodeURIComponent(categoryId)}`,
      { method: "DELETE", cobaltCookie, credentials: "omit" }
    )
  } catch (error) {
    if (error instanceof CobaltHttpError && error.status === 403 && liveSession) {
      logPolicyEndpointDiscrepancy({ action: "delete", liveSession, error })
    }
    logPolicyActionError("delete category", error)
    redirect(
      withNotice(returnTo, "error", getReadableErrorMessage(error, "delete"))
    )
  }

  revalidatePolicyPaths()
  redirect(withNotice(returnTo, "success", "Category deleted."))
}
