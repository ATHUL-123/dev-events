import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental : { turbopackFileSystemCacheForDev : true },
  reactCompiler : true,
  reactStrictMode : false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  }
};

export default nextConfig;
