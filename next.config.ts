import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental : { turbopackFileSystemCacheForDev : true },
  reactCompiler : true,
  reactStrictMode : false
};

export default nextConfig;
