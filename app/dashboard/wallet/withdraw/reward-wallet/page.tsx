"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import RewardToWalletForm from "@/app/dashboard/wallet/withdraw/reward-wallet/RewardToWalletForm/page";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function RewardWalletPage() {
  const [amount, setAmount] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
  }, []);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }),
    [token]
  );

  const fetchReward = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/wallet/balance", {
        headers,
      });
      setRewardBalance(res.data.reward);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }, [headers, token]);

  useEffect(() => {
    fetchReward();
  }, [fetchReward]);

  const handleRewardToWallet = async () => {
    if (amount <= 0) return setMessage("Enter a valid amount");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/withdraw/reward-to-wallet",
        { amount },
        { headers }
      );
      setMessage(res.data.message);
      setAmount(0);
      fetchReward();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || "Network error");
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Sticky Back to Dashboard */}
      <div className="bg-gray-50 border-b px-4 py-2 sticky top-16 z-40 rounded-t-xl">
        <Link
          href="/dashboard/wallet/withdraw"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-sm sm:text-base"
        >
          <LayoutDashboard size={18} />
          Back to Withdraw
        </Link>
      </div>

      <RewardToWalletForm
        amount={amount}
        setAmount={setAmount}
        handleSubmit={handleRewardToWallet}
        loading={loading}
        message={message}
        rewardBalance={rewardBalance}
      />
    </div>
  );
}
