/**
 * Diagnostics for the crash-looping-hourly investigation (portal pods going
 * fully unresponsive with no application logs before kubelet SIGTERMs them).
 * Everything here goes to the console. Remove once the cause is found.
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
  /** Windows retained for the crash snapshot (~1 min of history). */
  const ELU_WINDOW_HISTORY = 12

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
  })

  process.on("unhandledRejection", (reason) => {
    console.error(
      JSON.stringify({
        msg: "unhandled_rejection",
        rejectionReason: String(reason),
        ...captureDiagnosticSnapshot("unhandledRejection"),
      })
    )
  })

  process.on("SIGTERM", () => {
    const snapshot = captureDiagnosticSnapshot("SIGTERM")
    console.error(
      JSON.stringify({ msg: "sigterm_diagnostic_snapshot", ...snapshot })
    )

    // An open inspector session makes process.exit() block indefinitely in
    // "Waiting for the debugger to disconnect...", which is how a pod once
    // stayed alive and unresponsive for 3h40m after its SIGTERM. Close it
    // defensively so nothing can reintroduce that hang.
    try {
      if (inspector.url()) inspector.close()
    } catch {
      // Best effort; never block shutdown on teardown of a debug facility.
    }
    process.exit(0)
  })
}
