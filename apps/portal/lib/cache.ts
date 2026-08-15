import type { CobaltCacheOptions } from "@workspace/third-party/cobalt"

/**
 * How long public, non-personalized cobalt reads stay cached.
 *
 * This value is also what Next.js emits as `s-maxage` on the rendered routes,
 * so it is the TTL Cloudflare uses at the edge. Keep it in sync with the
 * `export const revalidate` declared on the public pages.
 *
 * The portal is scraped continuously (see
 * docs/portal-crash-loop-traffic-investigation.md); caching these reads is what
 * keeps that traffic from costing a cobalt round-trip and a full SSR render per
 * hit.
 */
export const PUBLIC_REVALIDATE_SECONDS = 300

export const PUBLIC_CACHE: CobaltCacheOptions = {
  revalidate: PUBLIC_REVALIDATE_SECONDS,
}
