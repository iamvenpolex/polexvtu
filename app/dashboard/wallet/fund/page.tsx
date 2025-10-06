"use client";

import { useState } from "react";
import api from "@/lib/api";

// Type for the successful fund response
interface FundResponse {
  authorization_url: string;
  reference: string;
}

// Type for Axios error response
interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function FundWalletPage() {
  const [amount, setAmount] = useState<number | "">(""); // empty by default
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFund = async () => {
    setError("");
    const email = localStorage.getItem("email");

    if (!email) {
      setError("Email missing. Please log in again.");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post<FundResponse>("/wallet/fund", {
        amount,
        email,
      });

      window.location.href = data.authorization_url;
    } catch (err: unknown) {
      // Fully type-safe Axios error handling
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const axiosErr = err as AxiosErrorResponse;
        if (axiosErr.response?.data?.message) {
          setError(axiosErr.response.data.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
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
