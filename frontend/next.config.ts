import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = process.env.BACKEND_URL || (isDev ? 'http://localhost:8080' : 'http://backend:8080');
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/ws/:path*',
        destination: `${backendUrl}/ws/:path*`,
      },
    ]
  },
};

export default nextConfig;
