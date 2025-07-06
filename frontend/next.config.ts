import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "s3.eu-west-3.amazonaws.com",
        pathname: "/freehunt-avatar/**",
      },
    ],
  },
};

export default nextConfig;
