import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour déploiement Vercel
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 heures
    dangerouslyAllowSVG: true,
  },
  // Optimisations pour Vercel
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react']
  },
  // Compression
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
