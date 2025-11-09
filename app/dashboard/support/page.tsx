"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowLeft, Mail, HelpCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface User {
  email: string;
}

export default function DashboardSupportPage() {
  const [user, setUser] = useState<User | null>(null);
  const [supportMessage, setSupportMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const profileRes = await axios.get<User>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(profileRes.data);
      } catch (err) {
        console.error("Fetch user error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSendMessage = () => {
    if (!supportMessage.trim() || !user) return;

    const text = `User (${user.email}) says: ${supportMessage}`;
    const whatsappUrl = `https://wa.me/2348032648367?text=${encodeURIComponent(
      text
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!user) return <p className="text-center py-20">User not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-1 ">
      {/* 🔙 Back to Dashboard */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <HelpCircle size={18} className="text-orange-600" />
          Support
        </h1>
      </div>

      {/* 💬 Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white p-1 rounded-xl shadow-lg"
      >
        <MessageCircle className="text-green-600 mx-auto mb-4" size={50} />
        <h1 className="text-2xl font-bold text-blue-900 mb-3 text-center">
          Need Help?
        </h1>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Our support team is available on WhatsApp. Fill in your message below
          and tap the button to start a conversation.
        </p>

        {/* User Email (Read-only) */}
        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 mb-4">
          <Mail className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full bg-transparent outline-none text-gray-800"
          />
        </div>

        {/* Support Message */}
        <textarea
          value={supportMessage}
          onChange={(e) => setSupportMessage(e.target.value)}
          rows={4}
          placeholder="Type your message here..."
          className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 mb-6"
        />

        {/* WhatsApp Button */}
        <button
          onClick={handleSendMessage}
          className="w-full bg-green-600 text-white font-semibold text-lg px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Send
        </button>
      </motion.div>
    </div>
  );
}
