"use client";

import { useEffect, useState } from "react";
import NotificationPopup from "./components/NotificationPopup";
import InfoTicker from "@/components/InfoTicker";
import Navbar from "./components/Navbar";

import axios, { AxiosError } from "axios";
import {
  Wifi,
  Eye,
  EyeOff,
  Gift,
  Wallet,
  PhoneCall,
  Send,
  Lightbulb,
  GraduationCap,
  Tv,
  History,
  MoreHorizontal,
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
          },
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
      {/* Navbar */}
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        <InfoTicker message="🔥 Special VTU Offer: Get 50% OFF on your first recharge! Limited time only! 🔥" />
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
          <div className="grid grid-cols-1 sm:grid-cols- gap-3 sm:gap-4">
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
              href="/dashboard/airtime"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
              Airtime
            </Link>
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

            <Link
              href="/dashboard/more"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
              More
            </Link>
          </div>
        </div>

        {/* ADS BANNER */}
        <div className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-100 shadow-xl my-6">
          {/* Glow effects */}
          <div className="absolute -top-10 -left-10 h-32 w-32 bg-orange-300/30 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-yellow-300/30 blur-3xl rounded-full" />

          {/* Floating icons */}
          <div className="absolute top-3 left-4 text-2xl animate-bounce">
            🔥
          </div>
          <div className="absolute bottom-3 right-4 text-2xl animate-pulse">
            ⚡
          </div>

          <div className="relative z-10 px-6 py-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md mb-3">
              LIMITED OFFER
            </div>

            {/* Main headline */}
            <h2 className="text-xl md:text-2xl font-extrabold text-orange-800 leading-tight">
              Get <span className="text-red-600">50% OFF</span> Your First
              Recharge
            </h2>

            {/* Sub text */}
            <p className="text-sm text-orange-700 mt-2">
              Fast VTU services for airtime, data & bills — anytime, anywhere.
            </p>

            {/* CTA Button */}
            <button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition active:scale-95">
              Recharge Now
            </button>

            {/* Footer note */}
            <p className="text-[11px] text-orange-600 mt-3 opacity-80">
              ⏳ Offer ends soon — don’t miss out!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
