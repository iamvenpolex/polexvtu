"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";

export default function FundWalletPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use the correct backend URL based on environment
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://your-production-backend.com"
      : "http://localhost:8080");

  const handleFund = async () => {
    setError("");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      setError("Email or token missing. Please log in again.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/wallet/fund`,
        { amount, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect user to Paystack checkout
      window.location.href = data.authorization_url;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-orange-500">Fund Wallet</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="number"
        placeholder="Enter amount"
        className="w-full p-3 mb-4 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value === "" ? "" : Number(e.target.value))
        }
        min={0}
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
