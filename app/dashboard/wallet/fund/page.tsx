"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, CreditCard } from "lucide-react";
import { apiFetch } from "@/app/dashboard/utils/api";

export default function FundWalletPage() {
  const [amount, setAmount] = useState(""); // store as string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFund = async () => {
    setError("");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      setError("Email or token missing. Please log in again.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!BASE_URL) throw new Error("Backend URL not configured");

      const { authorization_url } = await apiFetch<{
        authorization_url: string;
      }>(`${BASE_URL}/api/wallet/fund`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: { amount: numericAmount, email },
      });

      if (!authorization_url) throw new Error("Authorization URL not returned");
      window.location.href = authorization_url;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong. Try again.");
      console.error("Fund wallet error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Wallet size={18} className="text-orange-600" />
            Fund Wallet
          </h1>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-1 flex items-center justify-center p-2">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8">
          <div className="text-center mb-5">
            <div className="flex justify-center mb-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <CreditCard size={32} className="text-orange-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Add Funds to Your Wallet
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter the amount you wish to deposit securely via Paystack.
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          <input
            type="number"
            placeholder="Enter amount (₦)"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} // keep as string
          />

          <button
            onClick={handleFund}
            disabled={loading}
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Transactions are securely processed via Paystack.
          </p>
        </div>
      </main>
    </div>
  );
}
