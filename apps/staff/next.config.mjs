/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_BASE_PATH ?? ""

const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  output: "standalone",
  basePath,
}

export default nextConfig
