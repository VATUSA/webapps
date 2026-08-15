import * as Sentry from "@sentry/nextjs"

/**
 * Diagnostics for the crash-looping-hourly investigation (portal pods going
 * fully unresponsive with no application logs before kubelet SIGTERMs them).
 * Everything here reports to Sentry, since it's the only sink that survives
 * a pod restart — there's no log shipping configured for webapps-prod pods.
 * Remove once the cause is found.
 *
 * Note on what these numbers can and cannot show: process.resourceUsage() and
 * a bare performance.eventLoopUtilization() are both cumulative since process
 * start, so a stall in the final seconds before the kill is arithmetically
 * invisible in them — 30s of a fully blocked loop moves the lifetime
 * utilization of a 3h-old process by roughly 0.3%. The earlier snapshots
 * reported 5.95% lifetime utilization, which describes the three healthy hours
 * that preceded the incident and says nothing about the incident itself.
 *
 * The per-interval windows collected below are what actually distinguish the
 * two candidate failure modes: a *blocked* loop drives window utilization
 * toward 1.0, while a loop that is idle but not serving stays near zero.
 */
export async function registerNodeDiagnostics() {
  const { monitorEventLoopDelay, performance } = await import("node:perf_hooks")
  const inspector = await import("node:inspector")

  const histogram = monitorEventLoopDelay({ resolution: 20 })
  histogram.enable()

  const HEARTBEAT_INTERVAL_MS = 5_000
  const LAG_WARNING_THRESHOLD_MS = 2_000
  /** Heartbeats between unconditional Sentry events (~1/min at a 5s interval). */
  const SENTRY_HEARTBEAT_EVERY = 12
  /** Windows retained for the crash snapshot (~1 min of history). */
  const ELU_WINDOW_HISTORY = 12
  /** Last resort if the shutdown path itself wedges. Under the 30s grace period. */
  const SHUTDOWN_WATCHDOG_MS = 15_000

  type EluWindow = {
    utilization: number
    activeMs: number
    idleMs: number
    maxLagMs: number
    p99LagMs: number
    atUptimeSec: number
  }

  const recentEluWindows: EluWindow[] = []
  let lastElu = performance.eventLoopUtilization()
  let heartbeatCount = 0

  /**
   * A raw handle count can't distinguish accumulated inbound sockets from stuck
   * outbound ones, which is exactly the distinction that matters if the process
   * is idle but not serving.
   */
  const activeHandleCountsByType = (): Record<string, number> => {
    const handles =
      (
        process as unknown as { _getActiveHandles?: () => unknown[] }
      )._getActiveHandles?.() ?? []

    const counts: Record<string, number> = {}
    for (const handle of handles) {
      const name =
        (handle as { constructor?: { name?: string } })?.constructor?.name ??
        "Unknown"
      counts[name] = (counts[name] ?? 0) + 1
    }
    return counts
  }

  setInterval(() => {
    const currentElu = performance.eventLoopUtilization()
    const windowElu = performance.eventLoopUtilization(currentElu, lastElu)
    lastElu = currentElu

    const maxMs = histogram.max / 1e6
    const p99Ms = histogram.percentile(99) / 1e6

    const window: EluWindow = {
      utilization: windowElu.utilization,
      activeMs: windowElu.active,
      idleMs: windowElu.idle,
      maxLagMs: maxMs,
      p99LagMs: p99Ms,
      atUptimeSec: process.uptime(),
    }

    recentEluWindows.push(window)
    if (recentEluWindows.length > ELU_WINDOW_HISTORY) recentEluWindows.shift()

    console.log(
      JSON.stringify({
        msg: "event_loop_heartbeat",
        ...window,
        meanLagMs: histogram.mean / 1e6,
        memoryUsage: process.memoryUsage(),
      })
    )

    // Breadcrumbs cost nothing until something is captured and then ride along
    // with it, so the SIGTERM event carries the last minute of windows even
    // when no threshold was ever crossed.
    Sentry.addBreadcrumb({
      category: "diagnostic",
      level: "info",
      message: "event_loop_heartbeat",
      data: window,
    })

    heartbeatCount += 1

    const lagExceeded = maxMs > LAG_WARNING_THRESHOLD_MS
    // The unconditional low-rate heartbeat matters because under an
    // idle-but-unresponsive hang the lag threshold never trips, and with no log
    // shipping in webapps-prod the console line above goes nowhere. Without
    // this we would receive nothing at all from a wedged pod.
    const shouldReport =
      lagExceeded || heartbeatCount % SENTRY_HEARTBEAT_EVERY === 0

    if (shouldReport) {
      Sentry.captureMessage(
        lagExceeded
          ? "Event loop lag exceeded warning threshold"
          : "Event loop heartbeat",
        {
          level: lagExceeded ? "warning" : "info",
          tags: {
            diagnostic: lagExceeded ? "event_loop_lag" : "event_loop_heartbeat",
          },
          extra: {
            ...window,
            meanLagMs: histogram.mean / 1e6,
            recentEluWindows,
            activeHandles: activeHandleCountsByType(),
            memoryUsage: process.memoryUsage(),
          },
        }
      )
    }

    histogram.reset()
  }, HEARTBEAT_INTERVAL_MS).unref()

  const captureDiagnosticSnapshot = (reason: string) => ({
    reason,
    memoryUsage: process.memoryUsage(),
    resourceUsage: process.resourceUsage(),
    // Cumulative since start. Kept for continuity with earlier reports, but
    // recentEluWindows is what describes the run-up to the event.
    lifetimeEventLoopUtilization: performance.eventLoopUtilization(),
    recentEluWindows,
    activeHandles: activeHandleCountsByType(),
    uptimeSec: process.uptime(),
  })

  process.on("uncaughtException", (err) => {
    console.error(
      JSON.stringify({
        msg: "uncaught_exception",
        error: err.message,
        stack: err.stack,
        ...captureDiagnosticSnapshot("uncaughtException"),
      })
    )
    Sentry.captureException(err, {
      level: "fatal",
      tags: { diagnostic: "uncaught_exception" },
      extra: captureDiagnosticSnapshot("uncaughtException"),
    })
  })

  process.on("unhandledRejection", (reason) => {
    console.error(
      JSON.stringify({
        msg: "unhandled_rejection",
        rejectionReason: String(reason),
        ...captureDiagnosticSnapshot("unhandledRejection"),
      })
    )
    Sentry.captureException(reason, {
      level: "fatal",
      tags: { diagnostic: "unhandled_rejection" },
      extra: captureDiagnosticSnapshot("unhandledRejection"),
    })
  })

  process.on("SIGTERM", () => {
    const snapshot = captureDiagnosticSnapshot("SIGTERM")
    console.error(
      JSON.stringify({ msg: "sigterm_diagnostic_snapshot", ...snapshot })
    )

    Sentry.captureMessage("Portal received SIGTERM", {
      level: "error",
      tags: { diagnostic: "sigterm" },
      extra: snapshot,
    })

    // If the flush stalls we would sit here alive but not serving until kubelet
    // escalates. Take ourselves out first. Unref'd so it never keeps us up.
    const watchdog = setTimeout(() => {
      console.error(JSON.stringify({ msg: "sigterm_exit_watchdog_fired" }))
      process.kill(process.pid, "SIGKILL")
    }, SHUTDOWN_WATCHDOG_MS)
    watchdog.unref()

    void Sentry.flush(5_000).finally(() => {
      // An open inspector session makes process.exit() block indefinitely in
      // "Waiting for the debugger to disconnect...", which is how a pod stayed
      // alive and unresponsive for 3h40m after its SIGTERM. Sentry's ANR
      // integration opened one via captureStackTrace; it is disabled now, but
      // close defensively so nothing can reintroduce that hang. The watchdog
      // above cannot save us here — a JS timer does not fire once the process
      // is inside that native wait.
      try {
        if (inspector.url()) inspector.close()
      } catch {
        // Best effort; never block shutdown on teardown of a debug facility.
      }
      process.exit(0)
    })
  })
}
