// next.config.ts
import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // You can add more Next.js options here if needed
};

export default withPWA({
  ...nextConfig,
  dest: 'public',                       // PWA assets will be output here
  register: true,                       // automatically register service worker
  skipWaiting: true,                    // activate new SW immediately
  disable: process.env.NODE_ENV !== 'production', // only enable PWA in production
  // Optional: add runtimeCaching to cache assets and pages
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'https-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
  ],
});
