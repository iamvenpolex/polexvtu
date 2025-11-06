"use client";

import { useEffect, useState } from "react";
import NotificationPopup from "./components/NotificationPopup";

import axios, { AxiosError } from "axios";
import {
  Wifi,
  Eye,
  EyeOff,
  Gift,
  Wallet,
  Send,
  Lightbulb,
  GraduationCap,
  Tv,
  History,
} from "lucide-react";
import Link from "next/link";

// ------------------------
// Types
// ------------------------
interface User {
  id: number;
  first_name: string;
  last_name: string;
  balance: number;
  reward: number;
  email: string;
}

interface ApiError {
  message: string;
}

// ------------------------
// API Base URL
// ------------------------
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://polexvtu-backend.onrender.com";

export default function DashboardPage() {
  // ------------------------
  // States
  // ------------------------
  const [showBalance, setShowBalance] = useState(true);
  const [showReward, setShowReward] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [firstName, setFirstName] = useState("User");

  // ------------------------
  // Fetch user data
  // ------------------------
  useEffect(() => {
    const storedName = localStorage.getItem("firstName") || "User";
    setFirstName(storedName);

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const response = await axios.get<User>(
          `${API_BASE_URL}/api/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data);
      } catch (err: unknown) {
        console.error("❌ Error fetching data:", err);

        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<ApiError>;
          setError(axiosErr.response?.data?.message || "Failed to fetch data");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const interval = setInterval(fetchUserData, 45000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* ---------------- Wallet Dashboard ---------------- */}
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <h1 className="text-base sm:text-xl font-semibold text-orange-600">
              Hi, {firstName} 👋
            </h1>

            {/* ---------------- Transaction History CTA at top-right ---------------- */}
            {user && !loading && (
              <Link
                href="/dashboard/transactionhistory"
                className="inline-flex items-center px-3 py-1 text-xs sm:text-sm bg-orange-600 text-white rounded-full hover:bg-orange-700 transition"
              >
                History
              </Link>
            )}
          </div>

          {/* 🔔 Welcome Popup */}
          <NotificationPopup firstName={firstName} />

          {loading && (
            <p className="mt-3 text-gray-500">Loading wallet info...</p>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {user && !loading && (
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Wallet Balance
                </p>
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  {showBalance ? `₦${user.balance.toLocaleString()}` : "****"}
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </h2>
              </div>

              <div className="text-right">
                <p className="text-gray-500 text-xs sm:text-sm">
                  Reward Balance
                </p>
                <div className="flex items-center gap-2 text-green-600 font-semibold text-sm sm:text-base">
                  {showReward ? `₦${user.reward.toLocaleString()}` : "****"}
                  <button
                    onClick={() => setShowReward(!showReward)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showReward ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <Gift size={16} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- Updates Section ---------------- */}
        <div className="bg-white rounded-xl shadow-md p-2 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-700">
            📢 Latest Update: New discounts available on MTN data bundles!
          </p>
        </div>

        {/* ---------------- Fund Wallet Section ---------------- */}
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-6">
          <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Fund Wallet
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              href="/dashboard/wallet/fund"
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow text-xs sm:text-sm"
            >
              <Wallet size={18} />
              Fund Wallet
            </Link>
          </div>
        </div>

        {/* ---------------- Withdraw / Reward Section ---------------- */}
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-6">
          <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Withdraw / Reward
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Transfer / Withdraw Button */}
            <Link
              href="/dashboard/wallet/withdraw/wallet-tapam"
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 sm:py-4 rounded-lg shadow text-xs sm:text-sm"
            >
              <Send size={18} />
              Transfer
            </Link>

            {/* Reward to Wallet Button */}
            <Link
              href="/dashboard/wallet/withdraw/reward-wallet"
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow text-xs sm:text-sm"
            >
              <Gift size={18} />
              Reward to Wallet
            </Link>

            {/* View History Button - left on small, center on larger screens */}
            <Link
              href="/dashboard/tapamhistory"
              className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow text-xs sm:text-sm col-span-2 sm:col-span-1 sm:justify-center"
            >
              <History size={18} />
              View History
            </Link>
          </div>
        </div>

        {/* ---------------- Services Section ---------------- */}
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 space-y-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-700">
            Services
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/dashboard/data"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <Wifi className="w-5 h-5 sm:w-6 sm:h-6" />
              Data
            </Link>
            <Link
              href="/dashboard/electricity"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
              Electricity
            </Link>
            <Link
              href="/dashboard/education"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              Education
            </Link>
            <Link
              href="/dashboard/cabletv"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <Tv className="w-5 h-5 sm:w-6 sm:h-6" />
              Cable TV
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
