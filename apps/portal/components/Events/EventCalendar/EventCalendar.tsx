"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { type CobaltEvent } from "@workspace/third-party/cobalt"
import { fetchUpcomingEvents } from "@/actions/events"

interface CalendarProps {
  initialDate?: string | Date
  weekStartsOn?: 0 | 1
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}
function startOfWeek(d: Date, weekStartsOn = 0) {
  const date = new Date(d)
  const day = (date.getDay() - weekStartsOn + 7) % 7
  date.setDate(date.getDate() - day)
  date.setHours(0, 0, 0, 0)
  return date
}
function endOfWeek(d: Date, weekStartsOn = 0) {
  const s = startOfWeek(d, weekStartsOn)
  s.setDate(s.getDate() + 6)
  s.setHours(23, 59, 59, 999)
  return s
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function endOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}
function eventIntersectsDay(ev: CobaltEvent, day: Date) {
  const s = new Date(ev.start_timestamp)
  const e = new Date(ev.end_timestamp)
  return !(e < startOfDay(day) || s > endOfDay(day))
}

export default function EventCalendar({
  initialDate,
  weekStartsOn = 0,
}: CalendarProps) {
  const [viewDate, setViewDate] = useState<Date>(
    initialDate ? new Date(initialDate) : new Date()
  )
  const [events, setEvents] = useState<CobaltEvent[]>([])

  const monthStart = useMemo(() => startOfMonth(viewDate), [viewDate])
  const monthEnd = useMemo(() => endOfMonth(viewDate), [viewDate])
  const gridStart = useMemo(
    () => startOfWeek(monthStart, weekStartsOn),
    [monthStart, weekStartsOn]
  )
  useMemo(() => endOfWeek(monthEnd, weekStartsOn), [monthEnd, weekStartsOn])
  const grid = useMemo(() => {
    const days: Date[] = []
    const start = new Date(gridStart)
    for (let i = 0; i < 42; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d)
    }
    return days
  }, [gridStart])

  // Fetch events only once on mount using Server Action
  useEffect(() => {
    let aborted = false

    async function load() {
      try {
        const data = await fetchUpcomingEvents(50)
        if (aborted) return
        setEvents(data || [])
      } catch (e) {
        if (!aborted) {
          console.error("Error loading events:", e)
          toast.error("Failed to load events", {
            description:
              "Unable to fetch events from the server. Please try again later.",
          })
        }
      }
    }

    void load()
    return () => {
      aborted = true
    }
  }, [])

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }
  function goToday() {
    setViewDate(new Date())
  }

  const dayNames = useMemo(() => {
    const base = new Date(2021, 7, 1)
    const names = []
    for (let i = 0; i < 7; i++) {
      const idx = (i + weekStartsOn) % 7
      const name = new Date(base)
      name.setDate(base.getDate() + idx)
      names.push(name.toLocaleDateString(undefined, { weekday: "short" }))
    }
    return names
  }, [weekStartsOn])

  const today = useMemo(() => new Date(), [])

  return (
    <Card className="w-full border-border/70 bg-card/95 shadow-sm">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {viewDate.toLocaleString(undefined, {
                month: "long",
                year: "numeric",
              })}
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

        <div className="rounded-lg border border-border/60 bg-background">
          <div className="hidden grid-cols-7 gap-px border-b border-border/60 bg-muted/40 text-xs sm:grid">
            {dayNames.map((n) => (
              <div
                key={n}
                className="px-3 py-2 text-center font-medium tracking-wide text-muted-foreground uppercase"
              >
                {n}
              </div>
            ))}
          </div>

          <div className="hidden grid-cols-7 gap-1 bg-border/40 p-3 sm:grid">
            {grid.map((d) => {
              const inMonth = d.getMonth() === viewDate.getMonth()
              const isToday = isSameDay(d, today)
              const dayEvents = events
                .filter((ev) => eventIntersectsDay(ev, d))
                .sort(
                  (a, b) =>
                    new Date(a.start_timestamp).getTime() -
                    new Date(b.start_timestamp).getTime()
                )

              return (
                <div
                  key={d.toISOString()}
                  className={cn(
                    "flex min-h-[108px] flex-col overflow-hidden rounded-md border p-3 text-sm transition-colors duration-150",
                    "border-border/60 bg-card hover:border-border hover:bg-accent/30",
                    !inMonth &&
                      "border-border/50 bg-muted/45 text-muted-foreground/85 hover:bg-muted/60"
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                        isToday
                          ? "bg-chart-2 text-white ring-2 ring-chart-2/35 ring-offset-2 ring-offset-background"
                          : inMonth
                            ? "text-foreground"
                            : "text-muted-foreground"
                      )}
                    >
                      {d.getDate()}
                    </span>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    {dayEvents.length === 0 ? null : (
                      <div className="flex flex-col gap-2">
                        {dayEvents.map((ev) => {
                          const timeLabel = new Date(
                            ev.start_timestamp
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })

                          return (
                            <Link
                              key={ev.id}
                              href={`/events/${ev.id}`}
                              className="flex flex-col gap-1 rounded-md border border-border/50 bg-accent/40 px-3 py-2 text-xs transition-colors duration-150 hover:border-border hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                              <div className="font-medium text-foreground">
                                {ev.title}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {timeLabel}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-3 p-3 sm:hidden">
            {grid
              .filter((d) => events.some((ev) => eventIntersectsDay(ev, d)))
              .map((d) => {
                const dayEvents = events
                  .filter((ev) => eventIntersectsDay(ev, d))
                  .sort(
                    (a, b) =>
                      new Date(a.start_timestamp).getTime() -
                      new Date(b.start_timestamp).getTime()
                  )

                return (
                  <div
                    key={d.toISOString()}
                    className="rounded-md border border-border/60 p-3"
                  >
                    <div className="mb-2 text-sm font-medium text-foreground">
                      {d.toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex flex-col gap-2">
                      {dayEvents.map((ev) => {
                        const timeLabel = new Date(
                          ev.start_timestamp
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })

                        return (
                          <Link
                            key={ev.id}
                            href={`/events/${ev.id}`}
                            className="flex flex-col gap-1 rounded-md border border-border/50 bg-accent/40 px-3 py-3 text-sm transition-colors duration-150 hover:border-border hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                          >
                            <div className="font-medium text-foreground">
                              {ev.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {timeLabel}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
