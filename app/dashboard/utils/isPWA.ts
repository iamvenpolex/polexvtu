// utils/isPWA.ts
export const isPWA = (): boolean => {
  // Extend Navigator type to include 'standalone'
  const nav = window.navigator as Navigator & { standalone?: boolean };
  
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    nav.standalone === true
  );
};
