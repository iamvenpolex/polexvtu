"use client";

import { useState } from "react";
import axios from "axios";
import { Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://polexvtu-backend.onrender.com";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/forgot-password/request-reset`,
        { emailOrPhone: email },
      );

      if (res.data.success) {
        localStorage.setItem("resetEmail", email);
        router.push("/verify-code");
      } else {
        setMessage(res.data.message || "Failed to send reset code.");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      {/* BACKGROUND */}
      <div className="flex flex-1 items-center justify-center relative bg-[url('/home-bg.jpg')] bg-cover bg-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70" />

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl"
        >
          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-900">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Enter your email and we’ll send you a reset code.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* INPUT */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-black
                focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>

            {/* MESSAGE */}
            {message && (
              <div
                className={`text-sm text-center px-3 py-2 rounded-lg ${
                  message.toLowerCase().includes("success") ||
                  message.startsWith("✅")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>

          {/* FOOT LINK */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Back to Login
            </a>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
