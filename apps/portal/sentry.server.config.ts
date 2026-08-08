import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  integrations: [
    // Portal has been crash-looping hourly with the event loop apparently
    // fully blocked (no logs, all probes time out) before kubelet kills the
    // pod. ANR runs a worker thread that detects this and reports a stack
    // trace before that happens. Threshold is below the probe's 5s timeout
    // so we catch it before the kill. Remove once the cause is found.
    Sentry.anrIntegration({
      anrThreshold: 2_000,
      captureStackTrace: true,
      maxAnrEvents: 10,
    }),
  ],
})
