"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TestPage() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await api.get("/health");
        setMessage(`✅ Backend Connected: ${JSON.stringify(res.data)}`);
      } catch (err) {
        console.error(err);
        setMessage("❌ Could not connect to backend.");
      }
    };

    checkBackend();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
      <div className="p-6 rounded-xl bg-white shadow-md text-gray-800">
        <h1 className="text-2xl font-semibold mb-2">Backend Connection Test</h1>
        <p>{message}</p>
      </div>
    </main>
  );
}
