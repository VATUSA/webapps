const WARNING_THRESHOLD_WEEKS = 4
const DANGER_THRESHOLD_WEEKS = 2
const MS_PER_DAY = 24 * 60 * 60 * 1000
const DAYS_PER_WEEK = 7
const WARNING_THRESHOLD_DAYS = WARNING_THRESHOLD_WEEKS * DAYS_PER_WEEK
const DANGER_THRESHOLD_DAYS = DANGER_THRESHOLD_WEEKS * DAYS_PER_WEEK

export type EventUrgencyLevel = "none" | "warning" | "danger"

export type EventUrgency = {
  level: EventUrgencyLevel
  reason: string | null
}

function pluralizeWeeks(weeks: number) {
  return `${weeks} week${weeks === 1 ? "" : "s"}`
}

// Flags events submitted with little lead time before their own start, which
// leaves reviewers scant opportunity to catch problems before the event runs.
// Thresholds are expressed in weeks (not calendar months) per the review
// requirement: events must be submitted at least 4 weeks before they start.
export function getEventUrgency(
  createdAt: string,
  startTimestamp: string
): EventUrgency {
  const created = new Date(createdAt)
  const start = new Date(startTimestamp)
  if (Number.isNaN(created.getTime()) || Number.isNaN(start.getTime())) {
    return { level: "none", reason: null }
  }

  const leadDays = Math.floor(
    (start.getTime() - created.getTime()) / MS_PER_DAY
  )
  if (leadDays >= WARNING_THRESHOLD_DAYS) {
    return { level: "none", reason: null }
  }

  const level: EventUrgencyLevel =
    leadDays < DANGER_THRESHOLD_DAYS ? "danger" : "warning"
  const leadWeeks = Math.floor(Math.max(leadDays, 0) / DAYS_PER_WEEK)
  const reason =
    leadWeeks < 1
      ? "Submitted less than a week before the event starts"
      : `Submitted ${pluralizeWeeks(leadWeeks)} before the event starts`
  return { level, reason }
}
