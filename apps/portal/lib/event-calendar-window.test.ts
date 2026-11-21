import { expect, test } from "vitest"
import {
  addMonths,
  calendarWindow,
  monthKey,
  monthRange,
  parseMonthKey,
} from "./event-calendar-window"

const MAX_RANGE_MS = 366 * 24 * 60 * 60 * 1000
const NOW = new Date("2026-11-21T22:15:00Z")

test("initial window covers three months back through six ahead", () => {
  const w = calendarWindow(NOW)
  expect(w.from.toISOString()).toBe("2026-08-01T00:00:00.000Z")
  expect(w.to.toISOString()).toBe("2027-06-01T00:00:00.000Z")
  expect(w.months[0]).toBe("2026-08")
  expect(w.months.at(-1)).toBe("2027-05")
  expect(w.months).toHaveLength(10)
})

test("initial window crosses year boundaries backwards", () => {
  const w = calendarWindow(new Date("2026-01-31T23:59:59Z"))
  expect(w.from.toISOString()).toBe("2025-10-01T00:00:00.000Z")
  expect(w.to.toISOString()).toBe("2026-08-01T00:00:00.000Z")
})

test("initial window stays within cobalt's 366-day range limit", () => {
  for (let m = 0; m < 12; m++) {
    const w = calendarWindow(new Date(Date.UTC(2028, m, 15)))
    expect(w.to.getTime() - w.from.getTime()).toBeLessThanOrEqual(MAX_RANGE_MS)
  }
})

test("month keys round-trip and roll over years", () => {
  expect(monthKey(new Date("2026-01-31T23:59:59Z"))).toBe("2026-01")
  expect(monthKey(addMonths(new Date("2026-01-15T00:00:00Z"), -1))).toBe(
    "2025-12"
  )
  expect(parseMonthKey("2026-03", NOW)?.toISOString()).toBe(
    "2026-03-01T00:00:00.000Z"
  )
  const { from, to } = monthRange(parseMonthKey("2026-12", NOW)!)
  expect(from.toISOString()).toBe("2026-12-01T00:00:00.000Z")
  expect(to.toISOString()).toBe("2027-01-01T00:00:00.000Z")
})

test("rejects malformed or out-of-bounds month keys", () => {
  for (const bad of [
    "2026-13",
    "2026-00",
    "2026-1",
    "26-01",
    "abc",
    "1999-12",
    "2032-01",
  ]) {
    expect(parseMonthKey(bad, NOW)).toBeNull()
  }
  expect(parseMonthKey("2000-01", NOW)).not.toBeNull()
  expect(parseMonthKey("2031-12", NOW)).not.toBeNull()
})
