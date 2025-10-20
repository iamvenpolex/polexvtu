"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
interface User {
  email: string;
}

export default function AccountSettingsPage() {
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

    const text = `User (${user.email}) says: ${supportMessage}\n\n(Note: Users can only message admin to change profile info. For password changes, use the "Change Password" button.)`;

    const whatsappUrl = `https://wa.me/2348032648367?text=${encodeURIComponent(
      text
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!user) return <p className="text-center py-20">User not found</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-1">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-blue-900 mb-4 text-center">
            Account Settings
          </h1>

          <p className="text-sm text-gray-600 mb-6 text-center">
            You cannot change your profile here. To update any profile info,
            send a message to admin. For password changes, use the button below.
          </p>

          {/* User Email */}
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 mb-6">
            <Mail className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full bg-transparent outline-none text-gray-800"
            />
          </div>

          {/* Support Message */}
          <div className="mb-4">
            <label className=" text-gray-700 mb-2 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Message Admin
            </label>
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              rows={4}
              placeholder="Type your request here..."
              className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleSendMessage}
              className="flex-1 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Send to Admin
            </button>
            <a
              href="/forgot-password"
              className="flex-1 py-2 text-center bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Change Password
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
