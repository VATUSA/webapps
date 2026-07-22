import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  output: "standalone",
  assetPrefix: "/staff",
  basePath: "/staff",
  experimental: {
    serverActions: {
      allowedOrigins: ["www.vatusa.dev", "vatusa.dev", "www.vatusa.net", "vatusa.net", "localhost:8000"],
    },
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  // No SENTRY_AUTH_TOKEN in CI yet, so there's nothing to upload sourcemaps to.
  sourcemaps: { disable: true },
  telemetry: false,
})
