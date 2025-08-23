import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@react-email/components'],
  },
  // Disable font optimization to avoid lightningcss issues
  optimizeFonts: false,
};

export default nextConfig;
