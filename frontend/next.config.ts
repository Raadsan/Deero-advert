import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "radsanuploads.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "radsanuploads.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "deeroadvert.so",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "deero-advert.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "deero-advert-backend.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    unoptimized: process.env.NODE_ENV === 'development',
  },
   async redirects() {
    return [
      {
        source: '/user-domains',
        destination: '/user/domains',
        permanent: true,
      },
      {
        source: '/shop',
        destination: '/Packages',
        permanent: true,
      },
      {
        source: '/shop/:slug',
        destination: '/Packages/:slug',
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

