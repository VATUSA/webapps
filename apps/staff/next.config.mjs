/** @type {import('next').NextConfig} */
const basePath = process.env.STAFF_NEXT_BASE_PATH ?? ""

const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  output: "standalone",
  assetPrefix: basePath,
}

export default nextConfig
