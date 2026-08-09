import * as Sentry from "@sentry/nextjs"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config")
    await registerNodeDiagnostics()
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config")
  }
}

export const onRequestError = Sentry.captureRequestError

/**
 * Diagnostics for the crash-looping-hourly investigation (portal pods going
 * fully unresponsive with no application logs before kubelet SIGTERMs them).
 * Everything here reports to Sentry, since it's the only sink that survives
 * a pod restart — there's no log shipping configured for webapps-prod pods.
 * Remove once the cause is found.
 */
async function registerNodeDiagnostics() {
  const { monitorEventLoopDelay, performance } = await import(
    "node:perf_hooks"
  )

  const histogram = monitorEventLoopDelay({ resolution: 20 })
  histogram.enable()

  const HEARTBEAT_INTERVAL_MS = 5_000
  const LAG_WARNING_THRESHOLD_MS = 2_000

  setInterval(() => {
    const maxMs = histogram.max / 1e6
    const p99Ms = histogram.percentile(99) / 1e6

    console.log(
      JSON.stringify({
        msg: "event_loop_heartbeat",
        maxMs,
        p99Ms,
        meanMs: histogram.mean / 1e6,
        memoryUsage: process.memoryUsage(),
        uptimeSec: process.uptime(),
      })
    )

    if (maxMs > LAG_WARNING_THRESHOLD_MS) {
      Sentry.captureMessage("Event loop lag exceeded warning threshold", {
        level: "warning",
        tags: { diagnostic: "event_loop_lag" },
        extra: {
          maxMs,
          p99Ms,
          meanMs: histogram.mean / 1e6,
          memoryUsage: process.memoryUsage(),
          uptimeSec: process.uptime(),
        },
      })
    }

    histogram.reset()
  }, HEARTBEAT_INTERVAL_MS).unref()

  const captureDiagnosticSnapshot = (reason: string) => ({
    reason,
    memoryUsage: process.memoryUsage(),
    resourceUsage: process.resourceUsage(),
    eventLoopUtilization: performance.eventLoopUtilization(),
    activeHandles: (
      process as unknown as { _getActiveHandles?: () => unknown[] }
    )._getActiveHandles?.().length,
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
    console.error(JSON.stringify({ msg: "sigterm_diagnostic_snapshot", ...snapshot }))

    Sentry.captureMessage("Portal received SIGTERM", {
      level: "error",
      tags: { diagnostic: "sigterm" },
      extra: snapshot,
    })

    // terminationGracePeriodSeconds is 30s; give the flush plenty of room
    // before kubelet SIGKILLs us.
    void Sentry.flush(5_000).finally(() => process.exit(0))
  })
}
