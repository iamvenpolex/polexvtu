"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function FundCallbackPage() {
  const [status, setStatus] = useState<string>("verifying");
  const [message, setMessage] = useState<string>("Please wait...");
  const [reference, setReference] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://polexvtu-backend.onrender.com";

  // ✅ make verifyTransaction stable
  const verifyTransaction = useCallback(
    async (ref: string, payStatus: string | null) => {
      try {
        setMessage("Verifying your transaction...");
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const res = await axios.get(
          `${API_BASE_URL}/api/verify-transaction?reference=${ref}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.status === "success") {
          setStatus("success");
          setMessage("Your wallet has been funded successfully!");
        } else {
          setStatus("failed");
          setMessage("Payment verification failed.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        if (payStatus === "success") {
          setStatus("success");
          setMessage("Payment successful! Redirecting...");
        } else {
          setStatus("failed");
          setMessage("Payment failed or cancelled.");
        }
      }
    },
    [API_BASE_URL] // ✅ dependencies used inside function
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference");
    const payStatus = params.get("status");

    setReference(ref);

    if (ref) {
      verifyTransaction(ref, payStatus);
    } else {
      setStatus("failed");
      setMessage("No payment reference found.");
    }
  }, [verifyTransaction]); // ✅ add verifyTransaction to dependencies

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-orange-500 w-12 h-12 mb-3" />
            <h2 className="text-lg font-semibold text-gray-800">{message}</h2>
            <p className="text-sm text-gray-500 mt-2">
              Please don’t close this page...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-600 w-16 h-16 mb-3" />
            <h2 className="text-xl font-bold text-gray-800">
              Payment Successful 🎉
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Reference: <span className="font-mono">{reference}</span>
            </p>

            <Link
              href="/dashboard"
              className="mt-5 inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <ArrowLeft size={16} />
              Go back to Dashboard
            </Link>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center">
            <XCircle className="text-red-600 w-16 h-16 mb-3" />
            <h2 className="text-xl font-bold text-gray-800">Payment Failed</h2>
            <p className="text-sm text-gray-600 mt-2">
              Reference: <span className="font-mono">{reference}</span>
            </p>
            <p className="text-sm text-red-500 mt-1">{message}</p>

            <Link
              href="/dashboard/wallet/fund"
              className="mt-5 inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <ArrowLeft size={16} />
              Try Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
