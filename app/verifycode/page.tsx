"use client";

import { useState } from "react";
import axios from "axios";
import { KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function VerifyCodePage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://polexvtu-backend-production.up.railway.app";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/verify-code`, {
        emailOrPhone: email,
        code,
      });

      if (res.data.success) {
        localStorage.setItem("resetEmail", email);
        localStorage.setItem("resetCode", code);
        router.push("/reset-password");
      }

      setMessage(res.data.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "❌ Verification failed.");
      } else {
        setMessage("❌ Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-1 items-center justify-center bg-[url('/home-bg.jpg')] bg-cover bg-center relative pt-28 pb-28">
        <div className="absolute inset-0 bg-black/50"></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-11/12 max-w-md bg-white p-8 rounded-xl shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
            Verify Reset Code
          </h1>

          <p className="text-center text-gray-600 mb-4 text-sm">
            Enter the 6-digit code sent to your registered email.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-4 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* Code */}
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Message */}
            {message && (
              <p
                className={`text-center text-sm ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Didn’t get a code?{" "}
            <a
              href="/forgot-password"
              className="text-blue-600 font-semibold hover:underline"
            >
              Try Again
            </a>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
