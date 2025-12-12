// next-pwa.d.ts
declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
  }

  // Allow NextConfig combined with PWA options
  function withPWA(config: NextConfig & PWAConfig): NextConfig;

  export default withPWA;
}
