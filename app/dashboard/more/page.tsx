"use client";

import { Gamepad2, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function MorePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-1">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">More Services</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/dashboard/betting"
            className="flex items-center gap-4 bg-pink-600 hover:bg-pink-700 text-white font-medium p-6 rounded-xl shadow transition"
          >
            <Gamepad2 size={28} />
            Betting
          </Link>

          <Link
            href="/dashboard/sms"
            className="flex flex-col items-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            SMS
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl shadow transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
