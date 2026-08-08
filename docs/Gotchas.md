# Gotchas

## Never prefetch `/legacy/*` links

`/legacy/*` looks like an internal Next.js route, but it isn't. The ingress
(`www-ingress` in the `current` namespace) matches `/legacy/(.*)` and rewrites it
with `rewrite-target: /$1` onto the legacy Laravel site. Next.js can't see that,
so it treats these as internal routes and **auto-prefetches them** — `<Link>` has
prefetch enabled by default.

This took the legacy site down repeatedly. The navbar and footer both link to
`/legacy/*` paths, so they render on every single portal page. Each prefetch was
a real request that rendered a full Laravel page (20–40KB), meaning one portal
page view fired three or four full legacy page renders before the user clicked
anything. At peak this was over half of all traffic reaching the legacy site. It
saturated the legacy pod's small PHP-FPM pool, which starved the Kubernetes
health probe of a worker, failed the liveness check, and got the pod SIGKILLed —
30+ restarts in 20 hours. The RSC payload Next was asking for never comes back
from a PHP app anyway, so the work was wasted regardless.

**When adding a link that may point at `/legacy/*`, spread `legacyLinkProps(href)`
onto the `<Link>`** (see `apps/portal/lib/legacy.ts`). It disables prefetch for
legacy hrefs and leaves Next's default behaviour alone for everything else:

```tsx
import { legacyLinkProps } from "@/lib/legacy"

export function NavLink({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} {...legacyLinkProps(href)}>
      {title}
    </Link>
  )
}
```

This applies to any shared component that renders a caller-supplied `href`, since
a legacy path can reach it indirectly through nav config.
