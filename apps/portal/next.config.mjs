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

export default nextConfig
