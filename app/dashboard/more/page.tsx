"use client";

import { FileText, GraduationCap, Gamepad2, Tv, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function MorePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">More Services</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href="/dashboard/bills"
            className="flex items-center gap-4 bg-purple-600 hover:bg-purple-700 text-white font-medium p-6 rounded-xl shadow transition"
          >
            <FileText size={28} />
            Pay Bills
          </Link>

          <Link
            href="/dashboard/education"
            className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white font-medium p-6 rounded-xl shadow transition"
          >
            <GraduationCap size={28} />
            Education
          </Link>

          <Link
            href="/dashboard/betting"
            className="flex items-center gap-4 bg-pink-600 hover:bg-pink-700 text-white font-medium p-6 rounded-xl shadow transition"
          >
            <Gamepad2 size={28} />
            Betting
          </Link>

          <Link
            href="/dashboard/tv"
            className="flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white font-medium p-6 rounded-xl shadow transition"
          >
            <Tv size={28} />
            Cable TV
          </Link>

          <Link
            href="/dashboard/electricity"
            className="flex items-center gap-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium p-6 rounded-xl shadow transition"
          >
            <Lightbulb size={28} />
            Electricity
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
