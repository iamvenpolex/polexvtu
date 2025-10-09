"use client";

import { motion } from "framer-motion";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardSupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      {/* 🔙 Back to Dashboard */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* 💬 Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        <MessageCircle className="text-green-600 mx-auto mb-6" size={60} />
        <h1 className="text-3xl font-bold text-blue-900 mb-3">Need Help?</h1>
        <p className="text-gray-600 text-base mb-8">
          Our support team is available on WhatsApp. Tap below to start a
          conversation — we’re here to help!
        </p>

        <a
          href="https://wa.me/2348032648367"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white font-semibold text-lg px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Chat on WhatsApp
        </a>
      </motion.div>
    </div>
  );
}
