import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/user-domains',
        destination: '/user/domains',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/my-domains',
        destination: '/user/domains',
      },
    ];
  },
};

export default nextConfig;
