"use client";

import { Wallet, Wifi, Settings, Phone, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const user = {
    name: "Ayomiposi Adejorin",
    balance: 120500,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Dashboard Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-blue-900">
            Welcome back, {user.name} 👋
          </h1>
          <div className="mt-4 sm:mt-0 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold shadow">
            Balance: ₦{user.balance.toLocaleString()}
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-gray-700 mt-8 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Link
            href="/dashboard/wallet"
            className="flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-xl shadow transition"
          >
            <Wallet size={28} />
            Fund Wallet
          </Link>
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
          {/* See More instead of Pay Bills */}
          <Link
            href="/dashboard/more"
            className="flex flex-col items-center gap-3 bg-gray-500 hover:bg-gray-600 text-white font-medium py-6 rounded-xl shadow transition"
          >
            <MoreHorizontal size={28} />
            See More
          </Link>
        </div>

        {/* Settings Section */}
        <div className="mt-10">
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
