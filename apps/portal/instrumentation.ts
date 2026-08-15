import * as Sentry from "@sentry/nextjs"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config")
    // Dynamically imported, and kept in its own module, for the same reason
    // sentry.server.config is: this file is compiled for the Edge runtime too,
    // and a static reference would pull process.on / process.kill / inspector
    // into that bundle and warn about unsupported Node APIs on every build.
    const { registerNodeDiagnostics } = await import("./lib/node-diagnostics")
    await registerNodeDiagnostics()
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config")
  }
}

export const onRequestError = Sentry.captureRequestError
