"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { type CobaltEvent } from "@workspace/third-party/cobalt"

interface CalendarProps {
  /**
   * Fetched on the server so this route can be prerendered and cached at the
   * CDN. Previously this component called a server action on mount, which is a
   * POST and therefore never cacheable.
   */
  events: CobaltEvent[]
  initialDate?: string | Date
  weekStartsOn?: 0 | 1
}

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000
const LANE_HEIGHT = 22
const LANE_GAP = 2
const MAX_VISIBLE_ROWS = 4
const CELL_PADDING = 4
const DATE_NUMBER_SIZE = 28
const DATE_EVENTS_GAP = 8
const DATE_HEADER_HEIGHT = DATE_NUMBER_SIZE + DATE_EVENTS_GAP
const MULTI_DAY_TOP = CELL_PADDING + DATE_HEADER_HEIGHT

type EventRegion = {
  id: string
  label: string
  facilities: readonly string[]
  barClass: string
  borderClass: string
  swatchClass: string
}

const EVENT_REGIONS: readonly EventRegion[] = [
  {
    id: "northeast",
    label: "North East",
    facilities: ["ZBW", "ZDC", "ZNY", "ZOB", "ZWY"],
    barClass: "bg-sky-700 text-white",
    borderClass: "border-l-sky-700",
    swatchClass: "bg-sky-700",
  },
  {
    id: "southeast",
    label: "South East",
    facilities: ["ZID", "ZJX", "ZMA", "ZMO", "ZTL"],
    barClass: "bg-emerald-700 text-white",
    borderClass: "border-l-emerald-700",
    swatchClass: "bg-emerald-700",
  },
  {
    id: "southcentral",
    label: "South Central",
    facilities: ["ZAB", "ZFW", "ZHO", "ZHU", "ZME"],
    barClass: "bg-amber-700 text-white",
    borderClass: "border-l-amber-700",
    swatchClass: "bg-amber-700",
  },
  {
    id: "midwest",
    label: "Midwest",
    facilities: ["ZAU", "ZDV", "ZKC", "ZMP"],
    barClass: "bg-violet-700 text-white",
    borderClass: "border-l-violet-700",
    swatchClass: "bg-violet-700",
  },
  {
    id: "west",
    label: "West",
    facilities: ["ZAK", "ZAN", "HCF", "ZLA", "ZLC", "ZOA", "ZSE"],
    barClass: "bg-yellow-500 text-slate-900",
    borderClass: "border-l-yellow-500",
    swatchClass: "bg-yellow-500",
  },
  {
    id: "zhq",
    label: "ZHQ / Large Event",
    facilities: ["ZHQ"],
    barClass: "bg-chart-2 text-white",
    borderClass: "border-l-chart-2",
    swatchClass: "bg-chart-2",
  },
] as const

const FALLBACK_REGION_STYLE = {
  barClass: "bg-slate-600 text-white",
  borderClass: "border-l-slate-600",
  swatchClass: "bg-slate-600",
} as const

const FACILITY_TO_REGION = new Map<string, EventRegion>(
  EVENT_REGIONS.flatMap((region) =>
    region.facilities.map((facility) => [facility, region] as const)
  )
)

function eventFacility(ev: CobaltEvent): string | null {
  const code = ev.facility?.trim().toUpperCase()
  return code || null
}

function regionForFacility(facility: string | null) {
  if (!facility) return null
  return FACILITY_TO_REGION.get(facility) ?? null
}

function facilityBarClass(facility: string | null) {
  return regionForFacility(facility)?.barClass ?? FALLBACK_REGION_STYLE.barClass
}

function facilityBorderClass(facility: string | null) {
  return (
    regionForFacility(facility)?.borderClass ?? FALLBACK_REGION_STYLE.borderClass
  )
}

function eventTooltipLabel(ev: CobaltEvent, detail: string) {
  const facility = eventFacility(ev)
  return facility
    ? `${facility} · ${ev.title} · ${detail}`
    : `${ev.title} · ${detail}`
}

function previewBody(body?: string) {
  if (!body?.trim()) return null
  const plain = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim()
  if (!plain) return null
  return plain.length > 140 ? `${plain.slice(0, 137)}…` : plain
}

function formatHoverWhen(ev: CobaltEvent) {
  const { start, end } = eventTimes(ev)
  const time = formatZuluRange(start, end)
  if (isMultiDayBarEvent(ev)) {
    return `${formatMultiDayDateRange(start, end)} · ${time}`
  }
  return `${formatShortUTCDate(start)} · ${time}`
}

function EventHoverPreview({ event }: { event: CobaltEvent }) {
  const facility = eventFacility(event)
  const when = formatHoverWhen(event)
  const summary = previewBody(event.body)
  const multiDay = isMultiDayBarEvent(event)

  return (
    <div className="flex w-full flex-col gap-2 text-left">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-sm leading-snug font-semibold text-popover-foreground">
          {event.title}
        </p>
        {facility ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white",
              facilityBarClass(facility)
            )}
          >
            {facility}
          </span>
        ) : null}
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <p className="tabular-nums">{when}</p>
        {multiDay ? (
          <p className="font-medium text-popover-foreground/70">Multi-day event</p>
        ) : null}
      </div>

      {summary ? (
        <p className="line-clamp-3 border-t border-border/60 pt-2 text-xs leading-relaxed text-muted-foreground">
          {summary}
        </p>
      ) : null}

      <p className="text-[10px] font-medium tracking-wide text-muted-foreground/80 uppercase">
        View event details
      </p>
    </div>
  )
}

function EventHoverLink({
  event,
  href,
  className,
  style,
  children,
  detail,
}: {
  event: CobaltEvent
  href: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  detail: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        delay={200}
        closeDelay={80}
        render={
          <Link
            href={href}
            className={className}
            style={style}
            aria-label={eventTooltipLabel(event, detail)}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        align="start"
        className={cn(
          "flex z-50 w-72 max-w-[min(18rem,calc(100vw-1.5rem))] flex-col items-stretch gap-0 rounded-lg border border-border/70 bg-popover p-3 text-left text-popover-foreground shadow-lg ring-1 ring-foreground/10",
          "[&_.rotate-45]:bg-popover [&_.rotate-45]:fill-popover [&_.rotate-45]:ring-1 [&_.rotate-45]:ring-border/70"
        )}
      >
        <EventHoverPreview event={event} />
      </TooltipContent>
    </Tooltip>
  )
}

function startOfMonthUTC(d: Date) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0)
  )
}

function startOfWeekUTC(d: Date, weekStartsOn = 0) {
  const date = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0)
  )
  const day = (date.getUTCDay() - weekStartsOn + 7) % 7
  date.setUTCDate(date.getUTCDate() - day)
  return date
}

function isSameUTCDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  )
}

function startOfUTCDay(d: Date) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0)
  )
}

function endOfUTCDay(d: Date) {
  return new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      23,
      59,
      59,
      999
    )
  )
}

function addUTCDays(d: Date, days: number) {
  const next = new Date(d)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function utcDayKey(d: Date) {
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
}

function formatZuluHHMM(date: Date) {
  const hours = String(date.getUTCHours()).padStart(2, "0")
  const minutes = String(date.getUTCMinutes()).padStart(2, "0")
  return `${hours}${minutes}`
}

function formatZuluRange(start: Date, end: Date) {
  return `${formatZuluHHMM(start)}–${formatZuluHHMM(end)}Z`
}

function formatShortUTCDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

/** e.g. "Jul 24–26" or "Jul 31 – Aug 2" */
function formatMultiDayDateRange(start: Date, end: Date) {
  const sameMonth =
    start.getUTCFullYear() === end.getUTCFullYear() &&
    start.getUTCMonth() === end.getUTCMonth()

  if (sameMonth) {
    const month = start.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    })
    return `${month} ${start.getUTCDate()}–${end.getUTCDate()}`
  }

  return `${formatShortUTCDate(start)} – ${formatShortUTCDate(end)}`
}

function eventTimes(ev: CobaltEvent) {
  return {
    start: new Date(ev.start_timestamp),
    end: new Date(ev.end_timestamp),
  }
}

function isMultiDayBarEvent(ev: CobaltEvent) {
  const { start, end } = eventTimes(ev)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false
  const spansDays = !isSameUTCDay(start, end)
  const durationMs = end.getTime() - start.getTime()
  return spansDays && durationMs > TWELVE_HOURS_MS
}

/** Chip events: same-day, or short overnight (≤12h) — shown on UTC start day only. */
function showsAsChipOnDay(ev: CobaltEvent, day: Date) {
  if (isMultiDayBarEvent(ev)) return false
  const { start } = eventTimes(ev)
  if (Number.isNaN(start.getTime())) return false
  return isSameUTCDay(start, day)
}

function intervalIntersectsUTCDay(start: Date, end: Date, day: Date) {
  return !(end < startOfUTCDay(day) || start > endOfUTCDay(day))
}

type SpanSegment = {
  event: CobaltEvent
  startCol: number
  endCol: number
  lane: number
  continuesBefore: boolean
  continuesAfter: boolean
}

function packSpanLanes(
  segments: Omit<SpanSegment, "lane">[]
): SpanSegment[] {
  const sorted = [...segments].sort(
    (a, b) =>
      a.startCol - b.startCol ||
      b.endCol - a.endCol ||
      a.event.id - b.event.id
  )
  const laneEnds: number[] = []
  const packed: SpanSegment[] = []

  for (const seg of sorted) {
    let lane = 0
    while (lane < laneEnds.length && laneEnds[lane]! >= seg.startCol) {
      lane++
    }
    if (lane === laneEnds.length) {
      laneEnds.push(seg.endCol)
    } else {
      laneEnds[lane] = seg.endCol
    }
    packed.push({ ...seg, lane })
  }

  return packed
}

function buildWeekSpanSegments(
  weekDays: Date[],
  events: CobaltEvent[]
): SpanSegment[] {
  const weekStart = weekDays[0]!
  const weekEnd = weekDays[6]!
  const segments: Omit<SpanSegment, "lane">[] = []

  for (const ev of events) {
    if (!isMultiDayBarEvent(ev)) continue
    const { start, end } = eventTimes(ev)
    if (!weekDays.some((d) => intervalIntersectsUTCDay(start, end, d))) {
      continue
    }

    const eventStartDay = startOfUTCDay(start)
    const eventEndDay = startOfUTCDay(end)
    const clipStart =
      eventStartDay.getTime() < weekStart.getTime() ? weekStart : eventStartDay
    const clipEnd =
      eventEndDay.getTime() > weekEnd.getTime() ? weekEnd : eventEndDay

    if (
      clipStart.getTime() > weekEnd.getTime() ||
      clipEnd.getTime() < weekStart.getTime()
    ) {
      continue
    }

    const startCol = weekDays.findIndex((d) => isSameUTCDay(d, clipStart))
    const endCol = weekDays.findIndex((d) => isSameUTCDay(d, clipEnd))
    if (startCol < 0 || endCol < 0) continue

    segments.push({
      event: ev,
      startCol,
      endCol,
      continuesBefore: eventStartDay.getTime() < weekStart.getTime(),
      continuesAfter: eventEndDay.getTime() > weekEnd.getTime(),
    })
  }

  return packSpanLanes(segments)
}

function multiDayOccupiesDay(seg: SpanSegment, col: number) {
  return col >= seg.startCol && col <= seg.endCol
}

export default function EventCalendar({
  events,
  initialDate,
  weekStartsOn = 0,
}: CalendarProps) {
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (initialDate) {
      const d = new Date(initialDate)
      return startOfMonthUTC(d)
    }
    return startOfMonthUTC(new Date())
  })
  const [expandedDays, setExpandedDays] = useState<Set<string>>(
    () => new Set()
  )

  const monthStart = useMemo(() => startOfMonthUTC(viewDate), [viewDate])
  const gridStart = useMemo(
    () => startOfWeekUTC(monthStart, weekStartsOn),
    [monthStart, weekStartsOn]
  )
  const grid = useMemo(() => {
    const days: Date[] = []
    for (let i = 0; i < 42; i++) {
      days.push(addUTCDays(gridStart, i))
    }
    return days
  }, [gridStart])

  const weeks = useMemo(() => {
    const rows: Date[][] = []
    for (let i = 0; i < 6; i++) {
      rows.push(grid.slice(i * 7, i * 7 + 7))
    }
    return rows
  }, [grid])

  function prevMonth() {
    setExpandedDays(new Set())
    setViewDate(
      (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, 1))
    )
  }
  function nextMonth() {
    setExpandedDays(new Set())
    setViewDate(
      (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))
    )
  }
  function goToday() {
    setExpandedDays(new Set())
    setViewDate(startOfMonthUTC(new Date()))
  }

  function toggleDayExpanded(key: string) {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const dayNames = useMemo(() => {
    const names: string[] = []
    // 2021-08-01 was a Sunday in UTC
    const base = new Date(Date.UTC(2021, 7, 1))
    for (let i = 0; i < 7; i++) {
      const idx = (i + weekStartsOn) % 7
      const name = addUTCDays(base, idx)
      names.push(
        name.toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: "UTC",
        })
      )
    }
    return names
  }, [weekStartsOn])

  // Resolved after mount rather than during render: this route is prerendered
  // and cached, so a render-time "today" would be baked into the HTML and could
  // highlight the wrong day (and mismatch on hydration).
  const [today, setToday] = useState<Date | null>(null)
  useEffect(() => {
    setToday(new Date())
  }, [])

  const monthLabel = viewDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })

  const mobileDays = useMemo(() => {
    return grid.filter((d) =>
      events.some(
        (ev) =>
          showsAsChipOnDay(ev, d) ||
          (isMultiDayBarEvent(ev) && isSameUTCDay(eventTimes(ev).start, d))
      )
    )
  }, [grid, events])

  return (
    <Card className="w-full border-border/70 bg-card/95 shadow-sm">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {monthLabel}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                Zulu
              </span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevMonth}
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToday}
              aria-label="Today"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <ul
          className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground"
          aria-label="Event region color legend"
        >
          {EVENT_REGIONS.map((region) => (
            <li key={region.id} className="inline-flex items-center gap-1.5">
              <span
                className={cn("size-2.5 shrink-0 rounded-full", region.swatchClass)}
                aria-hidden
              />
              <span>{region.label}</span>
            </li>
          ))}
        </ul>

        <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
          <div className="hidden grid-cols-7 border-b border-border/60 bg-muted/40 text-xs sm:grid">
            {dayNames.map((n) => (
              <div
                key={n}
                className="px-2 py-2 text-center font-medium tracking-wide text-muted-foreground uppercase"
              >
                {n}
              </div>
            ))}
          </div>

          {/* Desktop: continuous week grid with multi-day bars */}
          <TooltipProvider delay={200}>
            <div className="hidden sm:block">
              {weeks.map((weekDays) => {
              const spanSegments = buildWeekSpanSegments(weekDays, events)
              const laneCount =
                spanSegments.length === 0
                  ? 0
                  : Math.max(...spanSegments.map((s) => s.lane)) + 1
              const visibleLaneCount = Math.min(laneCount, MAX_VISIBLE_ROWS)
              const lanesHeight =
                visibleLaneCount === 0
                  ? 0
                  : visibleLaneCount * LANE_HEIGHT +
                    (visibleLaneCount - 1) * LANE_GAP +
                    4

              return (
                <div
                  key={utcDayKey(weekDays[0]!)}
                  className="relative grid grid-cols-7 border-b border-border/60 last:border-b-0"
                >
                  {weekDays.map((d, col) => {
                    const dayKey = utcDayKey(d)
                    const inMonth = d.getUTCMonth() === viewDate.getUTCMonth()
                    const isToday = today ? isSameUTCDay(d, today) : false
                    const isExpanded = expandedDays.has(dayKey)

                    const occupyingSpans = spanSegments.filter((seg) =>
                      multiDayOccupiesDay(seg, col)
                    )
                    const visibleSpanSlots = occupyingSpans.filter(
                      (seg) => seg.lane < MAX_VISIBLE_ROWS
                    ).length

                    const dayChips = events
                      .filter((ev) => showsAsChipOnDay(ev, d))
                      .sort(
                        (a, b) =>
                          new Date(a.start_timestamp).getTime() -
                          new Date(b.start_timestamp).getTime()
                      )

                    const chipSlotsLeft = Math.max(
                      0,
                      MAX_VISIBLE_ROWS - visibleSpanSlots
                    )
                    const visibleChips = isExpanded
                      ? dayChips
                      : dayChips.slice(0, chipSlotsLeft)
                    const hiddenChipCount = isExpanded
                      ? 0
                      : Math.max(0, dayChips.length - chipSlotsLeft)
                    const hiddenSpanCount = occupyingSpans.filter(
                      (seg) => seg.lane >= MAX_VISIBLE_ROWS
                    ).length
                    const moreCount = hiddenChipCount + hiddenSpanCount

                    return (
                      <div
                        key={dayKey}
                        className={cn(
                          "flex min-h-[112px] flex-col border-r border-border/60 p-1 last:border-r-0",
                          inMonth ? "bg-background" : "bg-muted/35",
                          isToday && "bg-accent/20"
                        )}
                      >
                        <div
                          className="flex items-start justify-end px-0.5"
                          style={{ height: DATE_HEADER_HEIGHT }}
                        >
                          <span
                            className={cn(
                              "inline-flex size-7 items-center justify-center rounded-full text-sm font-medium",
                              isToday
                                ? "bg-chart-2 text-white"
                                : inMonth
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                            )}
                          >
                            {d.getUTCDate()}
                          </span>
                        </div>

                        {lanesHeight > 0 ? (
                          <div
                            className="shrink-0"
                            style={{ height: lanesHeight }}
                            aria-hidden
                          />
                        ) : null}

                        <div className="flex flex-1 flex-col gap-0.5 overflow-hidden pt-0.5">
                          {visibleChips.map((ev) => {
                            const { start, end } = eventTimes(ev)
                            const facility = eventFacility(ev)
                            const detail = formatZuluRange(start, end)
                            return (
                              <EventHoverLink
                                key={ev.id}
                                event={ev}
                                href={`/events/${ev.id}`}
                                detail={detail}
                                className={cn(
                                  "flex h-[22px] items-center gap-1 truncate rounded-sm border-l-2 bg-accent/35 px-1.5 text-[11px] leading-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                                  facilityBorderClass(facility)
                                )}
                              >
                                <span className="shrink-0 tabular-nums text-muted-foreground">
                                  {formatZuluHHMM(start)}
                                </span>
                                {facility ? (
                                  <span className="shrink-0 font-semibold text-foreground/80">
                                    {facility}
                                  </span>
                                ) : null}
                                <span className="truncate font-medium text-foreground">
                                  {ev.title}
                                </span>
                              </EventHoverLink>
                            )
                          })}

                          {moreCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => toggleDayExpanded(dayKey)}
                              className="h-[22px] rounded-sm px-1.5 text-left text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                              +{moreCount} more
                            </button>
                          ) : null}

                          {isExpanded && dayChips.length > chipSlotsLeft ? (
                            <button
                              type="button"
                              onClick={() => toggleDayExpanded(dayKey)}
                              className="h-[22px] rounded-sm px-1.5 text-left text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                              Show less
                            </button>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}

                  {/* Multi-day bars: gapless overlay aligned to columns */}
                  {visibleLaneCount > 0 ? (
                    <div
                      className="pointer-events-none absolute inset-x-0 z-10 grid grid-cols-7"
                      style={{ top: MULTI_DAY_TOP }}
                    >
                      {spanSegments
                        .filter((seg) => seg.lane < MAX_VISIBLE_ROWS)
                        .map((seg) => {
                          const { start, end } = eventTimes(seg.event)
                          const facility = eventFacility(seg.event)
                          const detail = `${formatMultiDayDateRange(start, end)} · ${formatZuluRange(start, end)}`
                          return (
                            <EventHoverLink
                              key={`${seg.event.id}-${seg.startCol}-${seg.endCol}`}
                              event={seg.event}
                              href={`/events/${seg.event.id}`}
                              detail={detail}
                              className={cn(
                                "pointer-events-auto mx-0.5 flex items-center gap-1 overflow-hidden px-1.5 text-[11px] font-medium shadow-sm transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                                facilityBarClass(facility),
                                seg.continuesBefore
                                  ? "rounded-l-none"
                                  : "rounded-l-md",
                                seg.continuesAfter
                                  ? "rounded-r-none"
                                  : "rounded-r-md"
                              )}
                              style={{
                                gridColumn: `${seg.startCol + 1} / ${seg.endCol + 2}`,
                                gridRow: 1,
                                marginTop: seg.lane * (LANE_HEIGHT + LANE_GAP),
                                height: LANE_HEIGHT,
                                alignSelf: "start",
                              }}
                            >
                              {seg.continuesBefore ? (
                                <span
                                  className="shrink-0 opacity-80"
                                  aria-hidden
                                >
                                  ‹
                                </span>
                              ) : null}
                              {facility ? (
                                <span className="shrink-0 font-semibold opacity-90">
                                  {facility}
                                </span>
                              ) : null}
                              <span className="truncate">{seg.event.title}</span>
                              {seg.continuesAfter ? (
                                <span
                                  className="shrink-0 opacity-80"
                                  aria-hidden
                                >
                                  ›
                                </span>
                              ) : null}
                            </EventHoverLink>
                          )
                        })}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
          </TooltipProvider>

          {/* Mobile: start-day agenda list */}
          <div className="space-y-3 p-3 sm:hidden">
            {mobileDays.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No upcoming events this month.
              </p>
            ) : (
              mobileDays.map((d) => {
                const dayEvents = events
                  .filter(
                    (ev) =>
                      showsAsChipOnDay(ev, d) ||
                      (isMultiDayBarEvent(ev) &&
                        isSameUTCDay(eventTimes(ev).start, d))
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.start_timestamp).getTime() -
                      new Date(b.start_timestamp).getTime()
                  )

                return (
                  <div
                    key={utcDayKey(d)}
                    className="rounded-md border border-border/60 p-3"
                  >
                    <div className="mb-2 text-sm font-medium text-foreground">
                      {d.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                      <span className="ml-1 text-muted-foreground">Z</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {dayEvents.map((ev) => {
                        const { start, end } = eventTimes(ev)
                        const multiDay = isMultiDayBarEvent(ev)
                        const facility = eventFacility(ev)
                        return (
                          <Link
                            key={ev.id}
                            href={`/events/${ev.id}`}
                            className={cn(
                              "flex flex-col gap-1 rounded-md border border-border/50 px-3 py-3 text-sm transition-colors duration-150 hover:border-border hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                              multiDay
                                ? cn("border-l-4 bg-accent/30", facilityBorderClass(facility))
                                : "bg-accent/40"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 font-medium text-foreground">
                                {ev.title}
                              </div>
                              {facility ? (
                                <span className="shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                  {facility}
                                </span>
                              ) : null}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {multiDay
                                ? `Multi-day · ${formatMultiDayDateRange(start, end)} · ${formatZuluRange(start, end)}`
                                : formatZuluRange(start, end)}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
