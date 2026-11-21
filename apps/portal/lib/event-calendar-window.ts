/**
 * The span of events the public calendar loads: whole UTC months, from
 * MONTHS_BACK months before the current one through MONTHS_AHEAD months after
 * it. Month-aligned so the cobalt request (and its cache key) only changes
 * once a month rather than on every render.
 *
 * Cobalt's /event/range rejects windows over 366 days, so keep
 * MONTHS_BACK + MONTHS_AHEAD + 1 at or under 12.
 */
export const CALENDAR_MONTHS_BACK = 3
export const CALENDAR_MONTHS_AHEAD = 6

export type CalendarWindow = {
  /** Inclusive: midnight UTC on the first day of the earliest month. */
  from: Date
  /** Exclusive: midnight UTC on the first day of the month after the last. */
  to: Date
  /** First day of the earliest month shown. */
  firstMonth: Date
  /** First day of the last month shown. */
  lastMonth: Date
}

export function calendarWindow(now: Date = new Date()): CalendarWindow {
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  return {
    from: new Date(Date.UTC(year, month - CALENDAR_MONTHS_BACK, 1)),
    to: new Date(Date.UTC(year, month + CALENDAR_MONTHS_AHEAD + 1, 1)),
    firstMonth: new Date(Date.UTC(year, month - CALENDAR_MONTHS_BACK, 1)),
    lastMonth: new Date(Date.UTC(year, month + CALENDAR_MONTHS_AHEAD, 1)),
  }
}
