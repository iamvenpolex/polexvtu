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
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6">
      {/* Back to Dashboard */}
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <LayoutDashboard size={18} />
          Back to Dashboard
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
        <Smartphone size={24} className="text-blue-600" />
        Buy Airtime
      </h1>
      <p className="text-gray-500 mt-1">Top up any Nigerian number instantly</p>

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
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
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
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400"
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
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          <Send size={20} />
          Buy Airtime
        </button>
      </form>
    </div>
  );
}
