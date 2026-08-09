/**
 * Liveness/readiness target for the Kubernetes probes.
 *
 * Deliberately dependency-free: no Cobalt calls, no session lookup, no data
 * fetching. The probes previously pointed at `/`, which renders the homepage
 * and fetches news + events server-side — so any slow render failed liveness
 * three times over and got the pod killed, even though the process was fine
 * and restarting it could not have helped.
 *
 * Liveness answers "is this process still able to serve HTTP", nothing more.
 *
 * No route segment config needed: Route Handlers are uncached by default as of
 * Next 15, and `export const dynamic` is removed under Cache Components.
 */
export function GET() {
  return new Response("ok", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}
