/**
 * Month bookkeeping for the public events calendar.
 *
 * The /events page server-renders a window of months around the current one
 * (calendarWindow) so the first view and nearby navigation need no extra
 * requests. Months outside it are loaded on demand, one UTC month at a time,
 * from /api/events/month/[month] as the user pages through the calendar.
 */
export const CALENDAR_MONTHS_BACK = 3
export const CALENDAR_MONTHS_AHEAD = 6

/**
 * Oldest and newest years the month endpoint serves. Bounds the set of
 * distinct cacheable URLs so a crawler walking "previous month" forever
 * cannot fan out into unbounded cobalt requests.
 */
export const CALENDAR_MIN_YEAR = 2000
export const CALENDAR_MAX_YEARS_AHEAD = 5

/** A UTC month, written "YYYY-MM". */
export type MonthKey = string

export type CalendarWindow = {
  /** Inclusive: midnight UTC on the first day of the earliest month. */
  from: Date
  /** Exclusive: midnight UTC on the first day of the month after the last. */
  to: Date
  /** Every month the window covers, oldest first. */
  months: MonthKey[]
}

export function monthKey(date: Date): MonthKey {
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  return `${date.getUTCFullYear()}-${month}`
}

/** The month `offset` months after the one containing `date`. */
export function addMonths(date: Date, offset: number): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1)
  )
}

/**
 * Parses a "YYYY-MM" key into the first instant of that month, or null when it
 * is malformed or outside the served years.
 */
export function parseMonthKey(
  key: string,
  now: Date = new Date()
): Date | null {
  const match = /^(\d{4})-(\d{2})$/.exec(key)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) return null
  if (
    year < CALENDAR_MIN_YEAR ||
    year > now.getUTCFullYear() + CALENDAR_MAX_YEARS_AHEAD
  ) {
    return null
  }
  return new Date(Date.UTC(year, month - 1, 1))
}

/** [start of month, start of next month) for a month's first instant. */
export function monthRange(monthStart: Date): { from: Date; to: Date } {
  return { from: monthStart, to: addMonths(monthStart, 1) }
}

/**
 * The months the /events page renders up front: CALENDAR_MONTHS_BACK before
 * the current UTC month through CALENDAR_MONTHS_AHEAD after it. Month-aligned
 * so the cobalt request (and its cache key) only changes once a month.
 *
 * Cobalt's /event/range rejects windows over 366 days, so keep
 * MONTHS_BACK + MONTHS_AHEAD + 1 at or under 12.
 */
export function calendarWindow(now: Date = new Date()): CalendarWindow {
  const first = addMonths(now, -CALENDAR_MONTHS_BACK)
  const count = CALENDAR_MONTHS_BACK + CALENDAR_MONTHS_AHEAD + 1
  const months: MonthKey[] = []
  for (let i = 0; i < count; i++) months.push(monthKey(addMonths(first, i)))
  return { from: first, to: addMonths(first, count), months }
}
