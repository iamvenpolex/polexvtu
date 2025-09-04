"use client";

import { useState } from "react";
import {
  Wifi,
  Phone,
  Eye,
  EyeOff,
  Gift,
  ArrowDownToLine,
  ArrowUpToLine,
  Lightbulb,
  GraduationCap,
  Tv,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [showReward, setShowReward] = useState(true);

  const user = {
    name: "Ayomiposi Adejorin",
    balance: 120500,
    reward: 2500,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      {/* Slightly reduced width on large screens */}
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Wallet Dashboard */}
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-base sm:text-xl font-semibold text-orange-600">
              Hi, {user.name.split(" ")[0]} 👋
            </h1>
          </div>

          {/* Wallet Balance */}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Wallet Balance</p>
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
              <p className="text-gray-500 text-xs sm:text-sm">Reward Balance</p>
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
        </div>

        {/* Updates Section */}
        <div className="bg-white rounded-xl shadow-md p-2 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-700">
            📢 Latest Update: New discounts available on MTN data bundles!
          </p>
        </div>

        {/* Fund & Withdraw */}
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Link
              href="/dashboard/wallet/fund"
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow text-xs sm:text-sm"
            >
              <ArrowDownToLine size={18} />
              Fund Wallet
            </Link>
            <Link
              href="/dashboard/wallet/withdraw"
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 sm:py-4 rounded-lg shadow text-xs sm:text-sm"
            >
              <ArrowUpToLine size={18} />
              Withdraw
            </Link>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 space-y-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-700">
            Services
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/dashboard/airtime"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
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
              href="/dashboard/betting"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
              Betting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
