import type { CobaltPolicyCategory } from "@workspace/third-party/cobalt"

/**
 * Cobalt already returns categories/documents sorted by sort_order and
 * excludes hidden documents for an anonymous caller (see getPolicies). What's
 * left to do here is drop any category left with zero documents once
 * hidden ones are excluded -- e.g. "Training Administration" today -- so the
 * public page doesn't render an empty tab.
 */
export function visibleCategoriesForDisplay(
  categories: CobaltPolicyCategory[]
): CobaltPolicyCategory[] {
  return categories.filter((category) => category.documents.length > 0)
}
