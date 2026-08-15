ARG NODE_VERSION=24.19.0-slim

# --platform=$BUILDPLATFORM keeps the install/build stages on the runner's
# native arch: pnpm/Next output here is plain JS, so there's nothing
# architecture-specific to cross-compile — only the final runtime stage below
# needs to resolve per target platform.
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION} AS base
WORKDIR /app
RUN corepack enable

FROM base AS dependencies
# Copy workspace manifests first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/portal/package.json apps/portal/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/third-party/package.json packages/third-party/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY .npmrc* ./

ARG TARGETARCH
# sharp (pulled in transitively for next/image) ships prebuilt native
# binaries selected per-arch via optionalDependencies "cpu"/"os" fields,
# which pnpm resolves against the *installing* machine's arch by default.
# This stage runs natively on $BUILDPLATFORM regardless of the image's
# target arch, so left alone every image — including arm64 targets — would
# silently ship an x64 sharp .node that crashes next/image at request time,
# not at build time. pnpm's own npm_config_arch/--config.arch overrides do
# NOT affect this selection (verified); only `pnpm.supportedArchitectures`
# in package.json does. Include BOTH process.arch (the native build host —
# lightningcss/Tailwind's oxide engine run *during* the build below and need
# a binary for the host, not the target) and $TARGETARCH (for sharp at
# runtime); restricting to target-only broke the build itself.
RUN NODE_TARGET_ARCH="$(case "$TARGETARCH" in amd64) echo x64 ;; arm64) echo arm64 ;; *) echo "unsupported TARGETARCH: $TARGETARCH" >&2; exit 1 ;; esac)" && \
    NODE_TARGET_ARCH="$NODE_TARGET_ARCH" node -e "\
      const fs = require('fs'); \
      const p = JSON.parse(fs.readFileSync('package.json')); \
      const archs = [...new Set([process.arch, process.env.NODE_TARGET_ARCH])]; \
      p.pnpm = p.pnpm || {}; \
      p.pnpm.supportedArchitectures = { os: ['linux'], cpu: archs }; \
      fs.writeFileSync('package.json', JSON.stringify(p, null, 2)); \
    "

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=dependencies /app ./
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web build

FROM node:${NODE_VERSION} AS app
WORKDIR /app

# Runtime defaults; override via env/.env/compose
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Monorepo standalone output paths
COPY --from=builder --chown=node:node /app/apps/portal/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/portal/.next/static ./apps/portal/.next/static
COPY --from=builder --chown=node:node /app/apps/portal/public ./apps/portal/public

USER node
EXPOSE 3000
# --report-on-signal is the one that matters for the hang investigation: the
# other two only fire on fatal V8 errors and uncaught exceptions, neither of
# which happens when the pod goes unresponsive. With this, `kill -USR2 1` in a
# wedged container dumps a report including the full libuv handle list and what
# each handle is waiting on. Use SIGUSR2, not SIGUSR1 — SIGUSR1 starts the V8
# inspector, and an open inspector session blocks process exit.
# Reports go to /tmp because /app is root-owned and the process runs as `node`.
CMD ["node", "--report-on-fatalerror", "--report-uncaught-exception", "--report-on-signal", "--report-directory=/tmp", "apps/portal/server.js"]
