import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'api.realworld.io',
      },
      {
        protocol: 'https',
        hostname: 'realworld-temp-api.herokuapp.com',
      },
      {
        protocol: 'https',
        hostname: 'conduit.productionready.io',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  typedRoutes: true,
}

export default nextConfig
