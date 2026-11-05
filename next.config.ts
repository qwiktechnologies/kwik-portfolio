import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  async redirects() {
    return [
      { source: "/get-in-touch", destination: "/contact", permanent: false },
      { source: "/get-into", destination: "/contact", permanent: false },
      { source: "/portfolio", destination: "/work", permanent: false },
      { source: "/services", destination: "/work", permanent: false },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/De Capitol Modern/**",
          "**/livecuncel lawyer app/**",
          "**/reseller-bus/**",
          "**/rust/**",
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
