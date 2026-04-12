const DEFAULT_AWC_BASE_URL = "https://aviationweather.gov/api/data"

const RAW_TEXT_KEYS = [
  "rawText",
  "raw_text",
  "rawOb",
  "raw_ob",
  "rawMETAR",
  "raw_metar",
  "rawTAF",
  "raw_taf",
  "raw",
  "text",
] as const

const COLLECTION_KEYS = [
  "data",
  "results",
  "items",
  "metars",
  "tafs",
  "response",
] as const

type AnyRecord = Record<string, unknown>

export type WeatherReport = {
  rawText: string
}

export type WeatherLookupResult = {
  stationId: string
  fetchedAt: string
  metar: WeatherReport | null
  taf: WeatherReport | null
  warnings: string[]
  errors: string[]
}

function getAwcBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_AWC_BASE_URL ?? DEFAULT_AWC_BASE_URL
  return base.endsWith("/") ? base.slice(0, -1) : base
}

export function normalizeStationCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, "")
}

export function isValidStationCode(input: string): boolean {
  return /^[A-Z0-9]{3,5}$/.test(normalizeStationCode(input))
}

function isRecord(value: unknown): value is AnyRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed.length ? trimmed : null
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  return null
}

function extractRawText(value: unknown): string | null {
  const direct = asNonEmptyString(value)
  if (direct) return direct

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractRawText(item)
      if (found) return found
    }
    return null
  }

  if (!isRecord(value)) return null

  for (const key of RAW_TEXT_KEYS) {
    const found = extractRawText(value[key])
    if (found) return found
  }

  for (const key of COLLECTION_KEYS) {
    const found = extractRawText(value[key])
    if (found) return found
  }

  return null
}

function extractReport(payload: unknown): WeatherReport | null {
  const rawText = extractRawText(payload)
  return rawText ? { rawText } : null
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? ""
  return contentType.includes("application/json")
    ? await response.json()
    : await response.text()
}

async function fetchAwcReport(
  path: "metar" | "taf",
  stationId: string
): Promise<unknown> {
  const url = new URL(`${getAwcBaseUrl()}/${path}`)
  url.searchParams.set("ids", stationId)
  url.searchParams.set("format", "json")

  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(
      `Aviation Weather Center responded with ${response.status} ${response.statusText}${body ? `: ${body}` : ""}`
    )
  }

  return await parseResponseBody(response)
}

function toReasonMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : String(reason)
}

export async function fetchAirportWeather(
  stationCode: string
): Promise<WeatherLookupResult> {
  const stationId = normalizeStationCode(stationCode)
  const fetchedAt = new Date().toISOString()

  const warnings: string[] = []
  const errors: string[] = []

  const [metarResult, tafResult] = await Promise.allSettled([
    fetchAwcReport("metar", stationId),
    fetchAwcReport("taf", stationId),
  ])

  let metar: WeatherReport | null = null
  let taf: WeatherReport | null = null

  if (metarResult.status === "fulfilled") {
    metar = extractReport(metarResult.value)
    if (!metar) warnings.push(`No METAR report found for ${stationId}.`)
  } else {
    errors.push(`METAR lookup failed for ${stationId}.`)
    warnings.push(toReasonMessage(metarResult.reason))
  }

  if (tafResult.status === "fulfilled") {
    taf = extractReport(tafResult.value)
    if (!taf) warnings.push(`No TAF report found for ${stationId}.`)
  } else {
    errors.push(`TAF lookup failed for ${stationId}.`)
    warnings.push(toReasonMessage(tafResult.reason))
  }

  return { stationId, fetchedAt, metar, taf, warnings, errors }
}

export function formatUtc(
  value: string | number | Date | null | undefined
): string | null {
  if (value === null || value === undefined) return null

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date)
}
