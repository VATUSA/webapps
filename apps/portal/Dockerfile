ARG NODE_VERSION=24.19.0-slim

FROM node:${NODE_VERSION} AS base
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
CMD ["node", "apps/portal/server.js"]
