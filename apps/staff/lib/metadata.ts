import type { Metadata } from "next"

export const STAFF_APP_NAME = "VATUSA Staff"

type StaffPageMetadataInput = {
  title: string
  description: string
}

export const STAFF_ROOT_METADATA: Metadata = {
  title: STAFF_APP_NAME,
  description:
    "Internal staff workspace for facility operations, events, news, and training workflows.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export function normalizeFacilityCode(value: string) {
  return value.trim().toUpperCase()
}

export function buildFacilityMetadata(facilityId: string): Metadata {
  const facilityCode = normalizeFacilityCode(facilityId) || "FACILITY"

  return {
    title: {
      default: `${facilityCode} | ${STAFF_APP_NAME}`,
      template: `%s | ${facilityCode} | ${STAFF_APP_NAME}`,
    },
  }
}

export function createStaffPageMetadata({
  title,
  description,
}: StaffPageMetadataInput): Metadata {
  return {
    title,
    description,
  }
}
