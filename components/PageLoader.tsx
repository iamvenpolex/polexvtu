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

    const timeout = setTimeout(() => setLoading(false), 700);

    return () => clearTimeout(timeout);
  }, [pathname]);

  // Only render children after loading finishes
  if (loading) return <Loader />;

  return <>{children}</>;
}
