"use client";

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, Gift, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReceiptData {
  id: string;
  date: string;
  amount: string;
  balance: string;
}

export default function RewardWalletPage() {
  const [amount, setAmount] = useState("");
  const [rewardBalance, setRewardBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }),
    [token]
  );

  const fetchReward = useCallback(async () => {
    if (!token || !API_BASE_URL) return;
    try {
      const response = await axios.get<{ reward: number }>(
        `${API_BASE_URL}/api/wallet/balance`,
        { headers }
      );
      setRewardBalance(response.data.reward);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching reward:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }, [headers, token, API_BASE_URL]);

  useEffect(() => {
    fetchReward();
  }, [fetchReward]);

  const handleRewardToWallet = async () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0)
      return setMessage("Enter a valid amount");

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/withdraw/reward-to-wallet`,
        { amount: numericAmount },
        { headers }
      );

      const newReceipt: ReceiptData = {
        id: `TRF-${Date.now()}`,
        date: new Date().toLocaleString(),
        amount: numericAmount.toFixed(2),
        balance: (rewardBalance - numericAmount).toFixed(2),
      };

      setReceiptData(newReceipt);
      setShowSuccess(true);
      setAmount("");
      fetchReward();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || "Network error");
      } else {
        setMessage("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-close modal after 4 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="min-h-screen bg-gray-100  sm:p-4">
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
            <Gift size={18} className="text-orange-600" />
            Reward to Wallet
          </h1>
        </div>
      </header>

      {/* Main Card */}
      <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl shadow p-5">
        <div className="text-center">
          <p className="text-gray-500 mb-2 text-sm">Reward Balance</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ₦{rewardBalance.toLocaleString()}
          </h2>
        </div>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          onClick={handleRewardToWallet}
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          {loading ? "Processing..." : "Transfer to Wallet"}
        </button>

        {message && (
          <p className="text-center text-sm mt-3 text-gray-600">{message}</p>
        )}
      </div>

      {/* ✅ Success Notification Modal */}
      <AnimatePresence>
        {showSuccess && receiptData && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-[300px] rounded-2xl shadow-lg p-5 text-center"
            >
              <div className="flex justify-center mb-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Transfer Successful
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                ₦{receiptData.amount} has been added to your wallet
              </p>

              <div className="text-xs text-gray-500 mb-2">
                <p>Transaction ID: {receiptData.id}</p>
                <p>{receiptData.date}</p>
              </div>

              <button
                onClick={() => setShowSuccess(false)}
                className="mt-2 bg-orange-600 text-white py-2 w-full rounded-lg text-sm"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
