import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  output: "standalone",
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/help/kb",
        destination: "/support/faq",
        permanent: true,
      },
    ]
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
