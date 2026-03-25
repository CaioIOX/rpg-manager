import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` : 'http://localhost:8080/api/:path*',
      },
      {
        source: '/ws/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/ws/:path*` : 'http://localhost:8080/ws/:path*',
      },
    ]
  },
};

export default nextConfig;
