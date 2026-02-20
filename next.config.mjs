import withSerwistInit from "@serwist/next"

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:3001"
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },
}

export default withSerwist(nextConfig)
