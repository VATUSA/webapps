"use server"

import {
  getNewsPage,
  getNewsPostById,
  type CobaltNewsItem,
} from "@workspace/third_party/cobalt"

export async function fetchNewsPostById(
  id: number | string
): Promise<CobaltNewsItem | null> {
  try {
    return await getNewsPostById(id)
  } catch (error) {
    console.error(`Server error fetching news post ${id}:`, error)
    return null
  }
}

export type PaginatedNewsResult = {
  page: number
  hasPrev: boolean
  hasNext: boolean
  items: CobaltNewsItem[]
}

export async function fetchNewsPage(
  page: number
): Promise<PaginatedNewsResult> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1

  try {
    // Probe next page so we can render proper pagination controls
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
