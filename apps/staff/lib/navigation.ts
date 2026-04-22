export function normalizeFacilityId(value?: string) {
  return value?.trim().toUpperCase() ?? ""
}

export function buildStaffHomeHref(facilityId?: string) {
  const normalized = normalizeFacilityId(facilityId)

  if (!normalized) {
    return "/"
  }

  if (normalized === "ZHQ") {
    return "/facility/zhq/division/events"
  }

  return `/facility/${normalized.toLowerCase()}/staff`
}
