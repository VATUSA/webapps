# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**From the repo root (runs across all apps/packages):**
```sh
pnpm install          # Install dependencies
pnpm run dev          # Start all apps in dev mode
pnpm run build        # Build all apps
pnpm run lint         # Lint all packages
pnpm run format       # Format with Prettier
pnpm run typecheck    # TypeScript type checking
```

**Per-app (substitute `./apps/staff` etc.):**
```sh
pnpm run --filter ./apps/portal dev
pnpm run --filter ./apps/staff dev
pnpm run --filter ./apps/my_vatusa dev
```

**Backend (required for auth and API calls):**
```sh
docker compose up -d   # Starts MySQL, Cobalt API, and Nginx reverse proxy
```
Cobalt API is reachable at `http://localhost:8000/cobalt`. MySQL is on port `13306`.

## Architecture

This is a **pnpm + Turbo monorepo** for the VATUSA (VATSIM US Division) web presence. Three apps share a common UI library and API client.

### Apps

| App | Framework | Port | Base path | Purpose |
|-----|-----------|------|-----------|---------|
| `apps/portal` | Next.js (App Router) | 3000 | `/` | Public-facing website — news, events, info, tools (mostly done) |
| `apps/staff` | Next.js (App Router) | 3001 | `/staff` | Staff/facility management dashboard (in progress) |
| `apps/my_vatusa` | Vite React SPA | 3002 | `/my` | User portal (not started) |

Portal and Staff use Next.js standalone output and are deployed as separate Docker containers behind Nginx.

### Shared packages

- **`packages/ui`** — shadcn-based component library (Card, Button, Sidebar, Avatar, Carousel, etc.) built with Tailwind CSS 4 + CVA. Consumed via path aliases like `@workspace/ui/components/card`.
- **`packages/third-party`** — Cobalt API client (`cobalt.ts`) and ACL utilities (`acl.ts`). All backend communication goes through here.
- **`packages/eslint-config`** and **`packages/typescript-config`** — shared tooling configs.

### Authentication

Both Next.js apps use **iron-session** for server-side encrypted session cookies. Auth flow:

1. User is redirected to VATSIM Connect (OAuth2).
2. Callback at `/auth/callback` exchanges the code with Cobalt, which returns a session token.
3. The Cobalt token is stored as cookie `vatusa-cobalt-token` and mirrored into the iron-session.
4. Session contains: CID, user profile, roles, and the raw Cobalt session data.

The session secret is `COOKIE_SECRET` (env var). See `apps/portal/lib/session.ts` and `apps/staff/lib/auth.ts`.

### Cobalt API client

`packages/third-party/src/cobalt.ts` is the single integration point for the backend. It reads:
- `COBALT_INTERNAL_BASE_URL` — used by server-side Next.js code (inside Docker: `http://cobalt:3000`)
- `NEXT_PUBLIC_COBALT_EXTERNAL_BASE_URL` — used by client-side code

Errors surface as `CobaltHttpError`. All API functions are async and typed via Zod.

### ACL (permissions)

`packages/third-party/src/acl.ts` normalizes raw Cobalt permission strings into typed global and facility-level permission sets. The Staff app's sidebar is dynamically filtered based on the current user's ACL. See `apps/staff/lib/acl.ts` for Staff-specific helpers.

### Key environment variables

| Variable | Where used |
|----------|------------|
| `COOKIE_SECRET` | iron-session encryption (both Next.js apps) |
| `COBALT_INTERNAL_BASE_URL` | Server-side Cobalt requests |
| `NEXT_PUBLIC_COBALT_EXTERNAL_BASE_URL` | Client-side Cobalt requests |
| `VATUSA_DISCORD_INVITE_URL` | Portal footer/links |

Copy `cobalt.env.example` for the Docker Compose backend config.

## Next.js version note

Both portal and staff use **Next.js 16**, which has breaking changes from 14/15. Double check App Router conventions and Server Actions API against the 16.x docs if something seems off.
