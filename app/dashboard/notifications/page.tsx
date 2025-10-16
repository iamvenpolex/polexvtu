"use client";

import { motion } from "framer-motion";
import { Bell, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// 🔔 Type for each notification
interface Notification {
  id: number;
  type: "info" | "success" | "warning";
  title: string;
  message: string;
  date: string;
}

export default function DashboardNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch notifications (mock or from API)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Example static data (replace with backend API later)
        const data: Notification[] = [
          {
            id: 4,
            type: "warning",
            title: "Service Notice",
            message:
              "Airtime and Betting services are currently unavailable. We’re working to restore them as soon as possible. Thank you for your patience.🙏",
            date: "Oct 16, 2025",
          },

          {
            id: 1,
            type: "info",
            title: "System Update",
            message: "We added new data bundles to all networks.",
            date: "Oct 9, 2025",
          },
          {
            id: 2,
            type: "success",
            title: "Referral Reward",
            message: "You earned ₦200 from your referral bonus!",
            date: "Oct 8, 2025",
          },
          {
            id: 3,
            type: "warning",
            title: "Scheduled Maintenance",
            message:
              "We’ll be performing maintenance tonight at 11:00 PM. Services may be temporarily unavailable.",
            date: "Oct 7, 2025",
          },
        ];

        setNotifications(data);
      } catch (err) {
        console.error("❌ Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        {/* 🔙 Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          ← Back to Dashboard
        </Link>

        {/* 🔔 Header */}
        <div className="flex items-center gap-2 mb-6">
          <Bell className="text-orange-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No new notifications.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-xl shadow-md flex items-start gap-3 bg-white border-l-4 ${
                  n.type === "success"
                    ? "border-green-500"
                    : n.type === "warning"
                    ? "border-yellow-500"
                    : "border-blue-500"
                }`}
              >
                <div className="pt-1">
                  {n.type === "success" ? (
                    <CheckCircle2 className="text-green-600" />
                  ) : n.type === "warning" ? (
                    <AlertTriangle className="text-yellow-600" />
                  ) : (
                    <Info className="text-blue-600" />
                  )}
                </div>

                <div>
                  <h2 className="font-semibold text-gray-800">{n.title}</h2>
                  <p className="text-gray-600 text-sm mb-1">{n.message}</p>
                  <span className="text-xs text-gray-400">{n.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
