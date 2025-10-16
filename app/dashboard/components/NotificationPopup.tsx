"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface NotificationPopupProps {
  firstName: string;
}

export default function NotificationPopup({
  firstName,
}: NotificationPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 👇 Show every time the dashboard is opened
    const timer = setTimeout(() => {
      setShow(true);
    }, 600); // small delay for smooth entry

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Hi, {firstName}! 👋
        </h2>
        <p className="text-gray-600 mb-6">
          Welcome back! We&apos;re glad to have you on your dashboard.
        </p>
        <button
          onClick={() => setShow(false)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition"
        >
          OK
        </button>
      </motion.div>
    </div>
  );
}
