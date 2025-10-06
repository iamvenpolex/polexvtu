"use client";

import { useState } from "react";
import api from "@/lib/api"; // your Axios instance

export default function FundWalletPage() {
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFund = async () => {
    setError("");

    const email = localStorage.getItem("email");
    if (!email) {
      setError("Email is missing. Please log in again.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/wallet/fund", { amount, email });

      // Redirect user to Paystack checkout
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setError("Failed to initialize payment. Try again.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response?.data?.message === "string"
      ) {
        setError((err as any).response.data.message);
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
