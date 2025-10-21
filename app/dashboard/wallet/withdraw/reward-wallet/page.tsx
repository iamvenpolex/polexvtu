"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import RewardToWalletForm from "@/app/dashboard/wallet/withdraw/reward-wallet/RewardToWalletForm/page";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RewardWalletPage() {
  const [amount, setAmount] = useState(""); // ✅ start empty
  const [rewardBalance, setRewardBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    if (!token || !API_BASE_URL) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wallet/balance`, {
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
      const res = await axios.post(
        `${API_BASE_URL}/api/withdraw/reward-to-wallet`,
        { amount: numericAmount },
        { headers }
      );
      setMessage(res.data.message);
      setAmount(""); // ✅ reset input
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

  // ✅ Clear message automatically after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Sticky Back to Dashboard */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
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
