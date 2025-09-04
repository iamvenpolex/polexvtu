"use client";

import { useState } from "react";
import {
  Wallet,
  Wifi,
  Settings,
  Phone,
  MoreHorizontal,
  Eye,
  EyeOff,
  Gift,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const user = {
    name: "Ayomiposi Adejorin",
    walletBalance: 120500,
    rewardBalance: 2500,
  };

  const [showBalance, setShowBalance] = useState(true);

  const firstName = user.name.split(" ")[0]; // Get first name

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Increased width from max-w-5xl → max-w-7xl */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Dashboard: Greeting + Wallet & Reward */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-blue-900">
            Hi, {firstName} 👋
          </h1>

          {/* Wallet Balance */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-gray-600">Wallet Balance</p>
              <h2 className="text-3xl font-semibold text-green-600 flex items-center gap-2">
                {showBalance
                  ? `₦${user.walletBalance.toLocaleString()}`
                  : "••••••"}
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showBalance ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </h2>
            </div>
          </div>

          {/* Reward Balance */}
          <div className="mt-4 flex items-center gap-2 text-yellow-600 font-medium">
            <Gift size={20} />
            Reward Balance: ₦{user.rewardBalance.toLocaleString()}
          </div>
        </div>

        {/* News & Updates Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl shadow p-4 text-blue-800 text-sm font-medium">
          📢 Latest Update: Enjoy 2% cashback when you fund your wallet this
          week!
        </div>

        {/* Fund & Withdraw Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-2 gap-4">
          <Link
            href="/dashboard/wallet/fund"
            className="flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-6 rounded-xl shadow transition"
          >
            <ArrowDownCircle size={28} />
            Fund Wallet
          </Link>
          <Link
            href="/dashboard/wallet/withdraw"
            className="flex flex-col items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-6 rounded-xl shadow transition"
          >
            <ArrowUpCircle size={28} />
            Withdraw
          </Link>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-700">Services</h2>

          {/* Service Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Link
              href="/dashboard/airtime"
              className="flex flex-col items-center gap-3 bg-pink-500 hover:bg-pink-600 text-white font-medium py-6 rounded-xl shadow transition"
            >
              <Phone size={28} />
              Buy Airtime
            </Link>
            <Link
              href="/dashboard/data"
              className="flex flex-col items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-medium py-6 rounded-xl shadow transition"
            >
              <Wifi size={28} />
              Buy Data
            </Link>
            <Link
              href="/dashboard/more"
              className="flex flex-col items-center gap-3 bg-gray-500 hover:bg-gray-600 text-white font-medium py-6 rounded-xl shadow transition"
            >
              <MoreHorizontal size={28} />
              See More
            </Link>
          </div>

          {/* Ads Section */}
          <div className="bg-gray-100 rounded-xl shadow flex items-center justify-between p-4">
            <img
              src="/ads1.jpg"
              alt="Ad Banner"
              className="h-20 w-auto rounded-lg object-cover"
            />
            <Link
              href="/dashboard/more"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            >
              Go
            </Link>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            <Settings size={22} />
            Account Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
