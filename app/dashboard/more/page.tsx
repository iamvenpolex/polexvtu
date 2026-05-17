"use client";

import { Gamepad2, MessageSquare, ArrowLeft, Grid3X3 } from "lucide-react";
import Link from "next/link";

export default function MorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      {/* HEADER */}
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex items-center gap-2">
            <Grid3X3 size={18} className="text-orange-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">More Services</h1>
              <p className="text-xs text-gray-500">
                Extra tools & features for your account
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* HERO CARD */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-orange-600 to-orange-600 p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Explore More Features</h2>
          <p className="mt-1 text-sm text-orange-100">
            Access additional services like betting tools and SMS utilities
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* BETTING */}
          <Link
            href="/dashboard/betting"
            className="group relative overflow-hidden rounded-3xl border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-pink-100 opacity-50 blur-2xl" />

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition">
                <Gamepad2 size={26} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">Betting</h3>
                <p className="text-sm text-gray-500">
                  Fund and manage betting wallets
                </p>
              </div>
            </div>

            <div className="mt-5 text-sm font-semibold text-pink-600">
              Open →
            </div>
          </Link>

          {/* SMS */}
          <Link
            href="/dashboard/sms"
            className="group relative overflow-hidden rounded-3xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-green-100 opacity-50 blur-2xl" />

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                <MessageSquare size={26} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">SMS</h3>
                <p className="text-sm text-gray-500">
                  Send bulk SMS and notifications
                </p>
              </div>
            </div>

            <div className="mt-5 text-sm font-semibold text-green-600">
              Open →
            </div>
          </Link>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
          More features will be added soon to improve your experience 🚀
        </div>
      </div>
    </div>
  );
}
