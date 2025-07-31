import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable problematic optimizations
  swcMinify: false,
};

export default nextConfig;
