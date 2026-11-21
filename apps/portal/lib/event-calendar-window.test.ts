import { expect, test } from "vitest"
import { calendarWindow } from "./event-calendar-window"

const MAX_RANGE_MS = 366 * 24 * 60 * 60 * 1000

test("covers three months back through six months ahead, month-aligned", () => {
  const w = calendarWindow(new Date("2026-11-21T22:15:00Z"))
  expect(w.from.toISOString()).toBe("2026-08-01T00:00:00.000Z")
  expect(w.to.toISOString()).toBe("2027-06-01T00:00:00.000Z")
  expect(w.firstMonth.toISOString()).toBe("2026-08-01T00:00:00.000Z")
  expect(w.lastMonth.toISOString()).toBe("2027-05-01T00:00:00.000Z")
})

test("crosses year boundaries backwards", () => {
  const w = calendarWindow(new Date("2026-01-31T23:59:59Z"))
  expect(w.from.toISOString()).toBe("2025-10-01T00:00:00.000Z")
  expect(w.to.toISOString()).toBe("2026-08-01T00:00:00.000Z")
})

test("stays within cobalt's 366-day range limit", () => {
  for (let m = 0; m < 12; m++) {
    const w = calendarWindow(new Date(Date.UTC(2028, m, 15)))
    expect(w.to.getTime() - w.from.getTime()).toBeLessThanOrEqual(MAX_RANGE_MS)
  }
})
