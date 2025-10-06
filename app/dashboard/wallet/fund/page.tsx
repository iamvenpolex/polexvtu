"use client";

import { useState } from "react";
import { apiFetch } from "@/app/dashboard/utils/api";

export default function FundWalletPage() {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ------------------------
  // Handle funding wallet (redirect to Paystack)
  // ------------------------
  const handleFund = async () => {
    setError("");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      setError("Email or token missing. Please log in again.");
      return;
    }

    if (amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      // Ensure backend URL is set
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!BASE_URL) throw new Error("Backend URL not configured");

      // Call backend to initialize Paystack transaction
      const { authorization_url } = await apiFetch<{
        authorization_url: string;
      }>(`${BASE_URL}/api/wallet/fund`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: { amount, email },
      });

      if (!authorization_url) throw new Error("Authorization URL not returned");

      // Redirect user to Paystack payment page
      window.location.href = authorization_url;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong. Try again.");
      console.error("Fund wallet error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // Render fund wallet form
  // ------------------------
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-orange-500">Fund Wallet</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="number"
        placeholder="Enter amount"
        className="w-full p-3 mb-4 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button
        onClick={handleFund}
        disabled={loading}
        className="w-full bg-orange-500 text-white p-3 rounded font-semibold hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Fund Wallet"}
      </button>
    </div>
  );
}
