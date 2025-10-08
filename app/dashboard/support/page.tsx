"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function DashboardSupportPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg text-center"
      >
        <MessageCircle className="text-green-600 mx-auto mb-4" size={48} />
        <h1 className="text-2xl font-bold text-blue-900 mb-2">Need Help?</h1>
        <p className="text-gray-600 text-sm mb-6">
          Our support team is available on WhatsApp. Tap below to start a chat.
        </p>

        <a
          href="https://wa.me/2348032648367"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
        >
          Chat on WhatsApp
        </a>
      </motion.div>
    </div>
  );
}
