"use client";

import { Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardNotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-100 px-1">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Bell size={18} className="text-orange-600" />
            Notifications
          </h1>
        </div>

        {/* No Notifications */}
        <div className="mx-4 mt-8 bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
            <Bell size={28} className="text-orange-500" />
          </div>

          <h2 className="text-base font-semibold text-gray-800">
            No notifications
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            You don&apos;t have any notifications at the moment.
          </p>
        </div>
      </div>
    </div>
  );
}
