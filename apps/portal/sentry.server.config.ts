import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  // Sentry.anrIntegration() was removed here deliberately — do not re-add it
  // without reading this first.
  //
  // 1. It could not see the failure it was added for. ANR fires when the main
  //    thread stops answering a worker's heartbeat, i.e. when the loop is
  //    *blocked*. The recorded snapshots show an idle loop (5.95% lifetime
  //    utilization, ~7.5% of a core) — under an idle-but-unresponsive hang the
  //    timers keep firing, the heartbeat keeps arriving, and ANR stays silent.
  //
  // 2. captureStackTrace: true starts the V8 inspector so the worker can pull a
  //    paused call stack. That leaves a live inspector session for the rest of
  //    the process lifetime, and Node then blocks on exit with "Waiting for the
  //    debugger to disconnect..." — observed in prod for 3h40m on
  //    portal-5c877fc777-z78j9, turning a routine restart into a long outage
  //    and putting an open debugger in webapps-prod.
  //
  // The windowed event-loop utilization in instrumentation.ts answers the
  // blocked-vs-idle question without either cost. If those windows come back
  // showing utilization near 1.0 during a stall, a blocked loop is confirmed
  // and ANR becomes worth reconsidering — with captureStackTrace left off.
  integrations: [],
})
