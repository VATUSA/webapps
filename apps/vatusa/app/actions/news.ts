"use server"

import {
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
