"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  CobaltHttpError,
  cobaltRequest,
  getNewsPage,
  getNewsPostById,
  type CobaltNewsItem,
  type CobaltSession,
} from "@workspace/third-party/cobalt"
import { ACTION, OBJECT } from "@/lib/acl"
import {
  CobaltPermissionError,
  requireLivePermissionOrThrow,
} from "@/lib/auth"

export type NewsActionState = {
  error: string | null
  success: string | null
  redirectTo?: string
}

function readStringField(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function normalizeFacilitySlug(value: string) {
  return value.trim().toLowerCase()
}

function buildNewsBasePath(facilitySlug: string) {
  return `/facility/${normalizeFacilitySlug(facilitySlug)}/news`
}

function buildNewsEditPath(facilitySlug: string, newsId: string) {
  return `${buildNewsBasePath(facilitySlug)}/${encodeURIComponent(newsId)}/edit`
}

function buildNewsNewPath(facilitySlug: string) {
  return `${buildNewsBasePath(facilitySlug)}/new`
}

function buildNewsPagePath(facilitySlug: string, page: number) {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1
  return `${buildNewsBasePath(facilitySlug)}?page=${safePage}`
}

function buildNewsPayload(formData: FormData) {
  const title = readStringField(formData, "title")
  const body = readStringField(formData, "body")

  if (!title) throw new Error("News title is required.")
  if (!body) throw new Error("News body is required.")

  return { title, body }
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

    return "You do not have live Cobalt permission to publish global news posts."
  }

  if (error instanceof CobaltHttpError && error.status === 403) {
    return buildNewsEndpointRejectionMessage(action)
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return "Something went wrong while saving the news post."
}

function buildNewsEndpointRejectionMessage(
  action: "create" | "update" | "delete"
) {
  if (action === "update") {
    return "Cobalt rejected the news update after live permission verification."
  }

  if (action === "delete") {
    return "Cobalt rejected news deletion after live permission verification."
  }

  return "Cobalt rejected news publishing after live permission verification."
}

function logNewsActionError(context: string, error: unknown) {
  console.error(`News action failed (${context}):`, error)
}

function logNewsEndpointDiscrepancy(input: {
  action: "create" | "update" | "delete"
  liveSession: CobaltSession
  error: CobaltHttpError
}) {
  console.error("News endpoint rejected request after live permission preflight.", {
    action: input.action,
    cid: input.liveSession.user?.cid,
    preflightAllowed: true,
    status: input.error.status,
    statusText: input.error.statusText,
    url: input.error.url,
    body: input.error.body,
  })
}

export async function fetchNewsPage(
  page: number
): Promise<{ page: number; hasPrev: boolean; hasNext: boolean; items: CobaltNewsItem[] }> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1

  try {
    const [currentItems, nextItems] = await Promise.all([
      getNewsPage(safePage),
      getNewsPage(safePage + 1),
    ])

    return {
      page: safePage,
      hasPrev: safePage > 1,
      hasNext: nextItems.length > 0,
      items: currentItems,
    }
  } catch (error) {
    console.error(`Server error fetching news page ${safePage}:`, error)
    return {
      page: safePage,
      hasPrev: safePage > 1,
      hasNext: false,
      items: [],
    }
  }
}

export async function fetchNewsPostForEdit(
  id: number | string
): Promise<CobaltNewsItem | null> {
  try {
    return await getNewsPostById(id)
  } catch (error) {
    console.error(`Server error fetching news post ${id}:`, error)
    return null
  }
}

function revalidateNewsPaths(facilitySlug: string, newsId?: string) {
  const basePath = buildNewsBasePath(facilitySlug)
  revalidatePath(basePath)
  revalidatePath(buildNewsNewPath(facilitySlug))

  if (newsId) {
    revalidatePath(buildNewsEditPath(facilitySlug, newsId))
  }
}

export async function createNewsPostAction(
  _prevState: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  let liveSession: CobaltSession | undefined
  try {
    const payload = buildNewsPayload(formData)
    const facilitySlug = normalizeFacilitySlug(
      readStringField(formData, "facilitySlug")
    )

    const cobaltCookie = await getCobaltCookie()
    if (!cobaltCookie) {
      return {
        error: "Missing Cobalt auth cookie.",
        success: null,
      }
    }

    const returnTo =
      readStringField(formData, "returnTo") || buildNewsBasePath(facilitySlug)

    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.newsPost,
      action: ACTION.write,
      allowGlobalFallback: false,
      message: "You do not have live Cobalt permission to publish global news posts.",
    })

    await cobaltRequest<unknown>("news/new", {
      method: "POST",
      body: payload,
      cobaltCookie,
      credentials: "omit",
    })

    revalidateNewsPaths(facilitySlug)

    return {
      error: null,
      success: "News post created successfully.",
      redirectTo: returnTo,
    }
  } catch (error) {
    if (error instanceof CobaltHttpError && error.status === 403 && liveSession) {
      logNewsEndpointDiscrepancy({
        action: "create",
        liveSession,
        error,
      })
    }
    logNewsActionError("create", error)
    return {
      error: getReadableErrorMessage(error, "create"),
      success: null,
    }
  }
}

export async function updateNewsPostAction(
  _prevState: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  let liveSession: CobaltSession | undefined
  try {
    const newsId = readStringField(formData, "newsId")
    if (!newsId) {
      return {
        error: "News post ID is required.",
        success: null,
      }
    }

    const payload = buildNewsPayload(formData)
    const facilitySlug = normalizeFacilitySlug(
      readStringField(formData, "facilitySlug")
    )

    const cobaltCookie = await getCobaltCookie()
    if (!cobaltCookie) {
      return {
        error: "Missing Cobalt auth cookie.",
        success: null,
      }
    }

    const returnTo =
      readStringField(formData, "returnTo") || buildNewsBasePath(facilitySlug)

    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.newsPost,
      action: ACTION.write,
      allowGlobalFallback: false,
      message: "You do not have live Cobalt permission to publish global news posts.",
    })

    await cobaltRequest<unknown>(`news/post/${encodeURIComponent(newsId)}`, {
      method: "POST",
      body: payload,
      cobaltCookie,
      credentials: "omit",
    })

    revalidateNewsPaths(facilitySlug, newsId)

    return {
      error: null,
      success: "News post saved successfully.",
      redirectTo: returnTo,
    }
  } catch (error) {
    if (error instanceof CobaltHttpError && error.status === 403 && liveSession) {
      logNewsEndpointDiscrepancy({
        action: "update",
        liveSession,
        error,
      })
    }
    logNewsActionError("update", error)
    return {
      error: getReadableErrorMessage(error, "update"),
      success: null,
    }
  }
}

export async function deleteNewsPostAction(formData: FormData): Promise<void> {
  const newsId = readStringField(formData, "newsId")
  const facilitySlug = normalizeFacilitySlug(
    readStringField(formData, "facilitySlug") ||
      readStringField(formData, "facilityId")
  )
  const page = Number(readStringField(formData, "page"))
  const returnTo =
    readStringField(formData, "returnTo") || buildNewsPagePath(facilitySlug, page)

  if (!newsId) {
    throw new Error("News post ID is required.")
  }

  const cobaltCookie = await getCobaltCookie()
  if (!cobaltCookie) {
    throw new Error("Missing Cobalt auth cookie.")
  }
  let liveSession: CobaltSession | undefined

  try {
    liveSession = await requireLivePermissionOrThrow({
      object: OBJECT.newsPost,
      action: ACTION.write,
      allowGlobalFallback: false,
      message: "You do not have live Cobalt permission to publish global news posts.",
    })

    await cobaltRequest<unknown>(`news/post/${encodeURIComponent(newsId)}`, {
      method: "DELETE",
      cobaltCookie,
      credentials: "omit",
    })
  } catch (error) {
    if (error instanceof CobaltHttpError && error.status === 403 && liveSession) {
      logNewsEndpointDiscrepancy({
        action: "delete",
        liveSession,
        error,
      })
    }
    logNewsActionError("delete", error)
    throw new Error(getReadableErrorMessage(error, "delete"))
  }

  revalidateNewsPaths(facilitySlug, newsId)
  redirect(returnTo)
}
