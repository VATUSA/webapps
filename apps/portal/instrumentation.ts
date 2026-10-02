export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Dynamically imported, and kept in its own module: this file is compiled
    // for the Edge runtime too, and a static reference would pull process.on /
    // process.kill / inspector into that bundle and warn about unsupported Node
    // APIs on every build.
    const { registerNodeDiagnostics } = await import("./lib/node-diagnostics")
    await registerNodeDiagnostics()
  }
}
