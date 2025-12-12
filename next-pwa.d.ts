declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  interface RuntimeCachingOptions {
    urlPattern: RegExp;
    handler: string;
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
    };
  }

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    runtimeCaching?: RuntimeCachingOptions[];
  }

  function withPWA(config: NextConfig & PWAConfig): NextConfig;

  export default withPWA;
}
