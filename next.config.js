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
    serverActions: true,
  },
}

module.exports = withContentlayer(nextConfig)
