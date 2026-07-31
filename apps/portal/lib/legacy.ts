/**
 * Helpers for links that point at the legacy VATUSA site.
 *
 * `/legacy/*` looks like an internal route to Next.js, but the ingress rewrites
 * it to the legacy Laravel app (`www-ingress` in the `current` namespace, with
 * rewrite-target `/$1`). Next can't tell the difference, so `<Link>` happily
 * auto-prefetches these on render.
 *
 * That is actively harmful: each prefetch is a real request that renders a full
 * Laravel page (20-40KB) on a pod with a small PHP-FPM pool, and the RSC payload
 * Next is asking for never comes back — so the work is wasted no matter what.
 * Because these links live in the navbar and footer, every portal page view was
 * firing several full legacy page renders before the user clicked anything,
 * saturating the pool and tripping the legacy pod's health probes.
 *
 * Always spread `legacyLinkProps(href)` onto a `<Link>` whose href may be legacy.
 */

export const LEGACY_PREFIX = "/legacy"

export function isLegacyHref(href: string): boolean {
  return href === LEGACY_PREFIX || href.startsWith(`${LEGACY_PREFIX}/`)
}

/**
 * Props to spread onto a `<Link>`: disables prefetch for legacy hrefs and
 * leaves Next's default behaviour untouched for everything else.
 */
export function legacyLinkProps(href: string): { prefetch?: false } {
  return isLegacyHref(href) ? { prefetch: false } : {}
}
