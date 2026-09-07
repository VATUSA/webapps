const WARNING_THRESHOLD_DAYS = 30
const DANGER_THRESHOLD_DAYS = 14
const MS_PER_DAY = 24 * 60 * 60 * 1000

export type EventUrgencyLevel = "none" | "warning" | "danger"

export type EventUrgency = {
  level: EventUrgencyLevel
  reason: string | null
}

function pluralizeDays(days: number) {
  return `${days} day${days === 1 ? "" : "s"}`
}

// Flags events submitted with little lead time before their own start, which
// leaves reviewers scant opportunity to catch problems before the event runs.
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
  const reason = `Submitted ${pluralizeDays(Math.max(leadDays, 0))} before the event starts`
  return { level, reason }
}
