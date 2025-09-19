"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function WithdrawPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="bg-gray-50 border-b px-4 py-2 sticky top-16 z-40 rounded-t-xl">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-sm sm:text-base"
        >
          <LayoutDashboard size={18} />
          Back to Dashboard
        </Link>
      </div>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-semibold text-gray-700">Withdraw Funds</h1>
        <Link
          href="/dashboard/wallet/withdraw/reward-wallet"
          className="block w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-center font-semibold shadow"
        >
          Reward → Wallet
        </Link>
        <Link
          href="/dashboard/wallet/withdraw/wallet-tapam"
          className="block w-full py-4 px-6 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-center font-semibold shadow"
        >
          Wallet → TapAm
        </Link>
      </div>
    </div>
  );
}
