import("./env.mjs")

const { withContentlayer } = require("next-contentlayer")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.githubusercontent.com", "1000logos.net"],
  },
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
}

module.exports = withContentlayer(nextConfig)
