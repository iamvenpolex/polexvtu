"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";

export default function PageLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    setLoading(true);

    // Minimum 300ms so the loader doesn't just flash
    const min = setTimeout(() => setLoading(false), 300);

    return () => clearTimeout(min);
  }, [pathname]);

  if (loading) return <Loader />;

  return <>{children}</>;
}
