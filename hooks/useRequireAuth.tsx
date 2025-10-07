// hooks/useRequireAuth.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export const useRequireAuth = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // redirect if not logged in
    }
  }, [user, router]);
};
