"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet, CreditCard, Info } from "lucide-react";
import { apiFetch } from "@/app/dashboard/utils/api";

export default function FundWalletPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Funding rules
  const MIN_AMOUNT = 100;
  const MAX_AMOUNT = 50000;

  // ✅ Paystack charge calculator
  // Local cards:
  // 1.5% + ₦100 (for amounts above ₦2500)
  // capped at ₦2000
  const calculatePaystackCharge = (amount: number) => {
    let charge = amount * 0.015;

    if (amount > 2500) {
      charge += 100;
    }

    if (charge > 2000) {
      charge = 2000;
    }

    return Math.ceil(charge);
  };

  const numericAmount = parseFloat(amount) || 0;

  // ✅ Total user pays
  const paystackCharge =
    numericAmount > 0 ? calculatePaystackCharge(numericAmount) : 0;

  const totalAmount = numericAmount + paystackCharge;

  const handleFund = async () => {
    setError("");

    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!email || !token) {
      setError("Email or token missing. Please log in again.");
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    // ✅ Minimum rule
    if (numericAmount < MIN_AMOUNT) {
      setError(`Minimum funding amount is ₦${MIN_AMOUNT}`);
      return;
    }

    // ✅ Maximum rule
    if (numericAmount > MAX_AMOUNT) {
      setError(`Maximum funding amount is ₦${MAX_AMOUNT.toLocaleString()}`);
      return;
    }

    setLoading(true);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!BASE_URL) {
        throw new Error("Backend URL not configured");
      }

      // ✅ Send total amount including Paystack charge
      const { authorization_url } = await apiFetch<{
        authorization_url: string;
      }>(`${BASE_URL}/api/wallet/fund`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          amount: totalAmount,
          actualAmount: numericAmount,
          paystackCharge,
          email,
        },
      });

      if (!authorization_url) {
        throw new Error("Authorization URL not returned");
      }

      window.location.href = authorization_url;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Try again.");
      }

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

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-3">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-md p-6 sm:p-8">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-100 p-4 rounded-full">
                <CreditCard size={34} className="text-orange-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Fund Your Wallet
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Securely add money to your wallet using Paystack.
            </p>
          </div>

          {/* Rules */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5">
            <div className="flex items-start gap-2">
              <Info size={18} className="text-orange-600 mt-0.5" />

              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  Minimum funding amount:
                  <span className="font-semibold"> ₦{MIN_AMOUNT}</span>
                </p>

                <p>
                  Maximum funding amount:
                  <span className="font-semibold">
                    {" "}
                    ₦{MAX_AMOUNT.toLocaleString()}
                  </span>
                </p>

                <p className="text-xs text-gray-500 pt-1">
                  Paystack transaction charges are added to your payment.
                </p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          {/* Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                ₦
              </span>

              <input
                type="number"
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Charges Breakdown */}
          {numericAmount > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Wallet Funding</span>
                <span className="font-medium text-gray-800">
                  ₦{numericAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Paystack Charge</span>
                <span className="font-medium text-gray-800">
                  ₦{paystackCharge.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">
                  Total Payment
                </span>

                <span className="font-bold text-orange-600 text-lg">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleFund}
            disabled={loading}
            className="w-full py-3 bg-orange-600 text-white rounded-2xl font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing Payment..." : "Proceed to Payment"}
          </button>

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-4 text-center">
            Payments are encrypted and securely processed by Paystack.
          </p>
        </div>
      </main>
    </div>
  );
}
