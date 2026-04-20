"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  cobaltRequest,
  getNewsPage,
  getNewsPostById,
  type CobaltNewsItem,
} from "@workspace/third-party/cobalt"

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

function normalizeFacilityId(value: string) {
  return value.trim().toUpperCase()
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

function getReadableErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return "Something went wrong while saving the news post."
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
  try {
    const payload = buildNewsPayload(formData)
    const facilitySlug = normalizeFacilitySlug(
      readStringField(formData, "facilitySlug")
    )
    const facilityId = normalizeFacilityId(facilitySlug)

    const cobaltCookie = await getCobaltCookie()
    if (!cobaltCookie) {
      return {
        error: "Missing Cobalt auth cookie.",
        success: null,
      }
    }

    const returnTo =
      readStringField(formData, "returnTo") || buildNewsBasePath(facilitySlug)

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
    return {
      error: getReadableErrorMessage(error),
      success: null,
    }
  }
}

export async function updateNewsPostAction(
  _prevState: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
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
    const facilityId = normalizeFacilityId(facilitySlug)

    const cobaltCookie = await getCobaltCookie()
    if (!cobaltCookie) {
      return {
        error: "Missing Cobalt auth cookie.",
        success: null,
      }
    }

    const returnTo =
      readStringField(formData, "returnTo") || buildNewsBasePath(facilitySlug)

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
    return {
      error: getReadableErrorMessage(error),
      success: null,
    }
  }
}

export async function deleteNewsPostAction(formData: FormData): Promise<void> {
  const newsId = readStringField(formData, "newsId")
  const facilitySlug = normalizeFacilitySlug(
    readStringField(formData, "facilitySlug")
  )
  const facilityId = normalizeFacilityId(facilitySlug)
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

  await cobaltRequest<unknown>(`news/post/${encodeURIComponent(newsId)}`, {
    method: "DELETE",
    cobaltCookie,
    credentials: "omit",
  })

  revalidateNewsPaths(facilitySlug, newsId)
  redirect(returnTo)
}

