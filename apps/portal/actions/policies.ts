"use server"

import {
  getPolicies,
  type CobaltPolicyCategory,
} from "@workspace/third-party/cobalt"
import { PUBLIC_CACHE } from "@/lib/cache"

/**
 * Unlike news/events, this distinguishes a real backend failure from a
 * genuinely empty response: an empty policies page looks legitimate to a
 * visitor, and silently swallowing an outage into "no policies" (the
 * actions/news.ts convention) would hide it instead of surfacing an error
 * state.
 */
export type PoliciesResult =
  | { ok: true; categories: CobaltPolicyCategory[] }
  | { ok: false; categories: [] }

export async function fetchPolicies(): Promise<PoliciesResult> {
  try {
    const categories = await getPolicies(undefined, PUBLIC_CACHE)
    return { ok: true, categories }
  } catch (error) {
    console.error("Server error fetching policies:", error)
    return { ok: false, categories: [] }
  }
}
