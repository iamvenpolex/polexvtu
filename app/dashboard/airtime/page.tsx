// app/dashboard/airtime/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Smartphone, Send, LayoutDashboard } from "lucide-react";

export default function AirtimePage() {
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Buying ₦${amount} airtime for ${phone} on ${network}`);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl">
      {/* Sticky Back to Dashboard */}
      <div className="bg-gray-50 border-b px-4 py-2 sticky top-16 z-40 rounded-t-xl">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-sm sm:text-base"
        >
          <LayoutDashboard size={18} />
          Back to Dashboard
        </Link>
      </div>

      {/* Page Content */}
      <div className="p-4 sm:p-6">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Smartphone size={22} className="text-orange-500" />
          Buy Airtime
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Top up any Nigerian number instantly
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Network Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Network
            </label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900"
            >
              <option value="">-- Choose Network --</option>
              <option value="MTN">MTN</option>
              <option value="Airtel">Airtel</option>
              <option value="Glo">Glo</option>
              <option value="9mobile">9mobile</option>
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08012345678"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
          >
            <Send size={20} />
            Buy Airtime
          </button>
        </form>
      </div>
    </div>
  );
}
