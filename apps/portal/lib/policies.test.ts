import { expect, test } from "vitest"
import type { CobaltPolicyCategory } from "@workspace/third-party/cobalt"
import { visibleCategoriesForDisplay } from "./policies"

function category(
  overrides: Partial<CobaltPolicyCategory>
): CobaltPolicyCategory {
  return {
    id: 1,
    title: "Category",
    sort_order: 0,
    documents: [],
    ...overrides,
  }
}

test("visibleCategoriesForDisplay drops categories with no documents", () => {
  const populated = category({ id: 1, title: "General Division" })
  populated.documents = [
    {
      id: 1,
      policy_category_id: 1,
      ident: "DP001",
      title: "General Division Policy",
      summary: "",
      document_url: "https://example.test/dp001.pdf",
      effective_date: "2026-09-01",
      hidden: false,
      sort_order: 0,
      created_by_cid: 0,
      updated_by_cid: 0,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
  ]
  const empty = category({ id: 2, title: "Training Administration" })

  const result = visibleCategoriesForDisplay([populated, empty])

  expect(result).toEqual([populated])
})

test("visibleCategoriesForDisplay returns an empty list when every category is empty", () => {
  const result = visibleCategoriesForDisplay([
    category({ id: 1 }),
    category({ id: 2 }),
  ])
  expect(result).toEqual([])
})

test("visibleCategoriesForDisplay preserves input order", () => {
  const first = category({ id: 1 })
  first.documents = [
    {
      id: 10,
      policy_category_id: 1,
      ident: "A",
      title: "A",
      summary: "",
      document_url: "https://example.test/a.pdf",
      effective_date: "2026-01-01",
      hidden: false,
      sort_order: 0,
      created_by_cid: 0,
      updated_by_cid: 0,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
  ]
  const second = category({ id: 2 })
  second.documents = [
    {
      id: 11,
      policy_category_id: 2,
      ident: "B",
      title: "B",
      summary: "",
      document_url: "https://example.test/b.pdf",
      effective_date: "2026-01-01",
      hidden: false,
      sort_order: 0,
      created_by_cid: 0,
      updated_by_cid: 0,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    },
  ]

  expect(visibleCategoriesForDisplay([first, second])).toEqual([
    first,
    second,
  ])
})
