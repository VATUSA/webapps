/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  output: "standalone",
  assetPrefix: "/staff",
  basePath: "/staff",
  experimental: {
    serverActions: {
      allowedOrigins: ["www.vatusa.dev", "vatusa.dev", "vatusa.net", "localhost:8000"],
    },
  },
}

export default nextConfig
