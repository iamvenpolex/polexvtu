"use client";

import { useState } from "react";
import axios from "axios";
import { Lock, Check, X, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://polexvtu-backend.onrender.com";

  // Password rules
  const passwordRules = [
    { label: "At least 8 characters", test: /.{8,}/ },
    { label: "At least one uppercase letter", test: /[A-Z]/ },
    { label: "At least one lowercase letter", test: /[a-z]/ },
    { label: "At least one number", test: /\d/ },
    {
      label: "At least one special character (@$!%*?&._-)",
      test: /[@$!%*?&._-]/,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const email = localStorage.getItem("resetEmail");
    const code = localStorage.getItem("resetCode");

    if (!email || !code) {
      setMessage("❌ Verification required. Go back and verify your email.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      setLoading(false);
      return;
    }

    // Strong password validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-]).{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      setMessage(
        "❌ Password must include uppercase, lowercase, number, special character, and be at least 8 characters long."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/forgot-password/reset-password`,
        {
          emailOrPhone: email,
          code,
          newPassword,
        }
      );

      setMessage(res.data.message);

      if (res.data.success) {
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetCode");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(
          err.response?.data?.message || "❌ Failed to reset password."
        );
      } else {
        setMessage("❌ Something went wrong. Please try again.");
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
            Reset Password
          </h1>

          <p className="text-center text-gray-600 mb-4 text-sm">
            Enter your new password below.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Checklist */}
            {newPassword.length > 0 && (
              <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                <p className="text-gray-700 font-semibold mb-2">
                  Password must contain:
                </p>
                <ul className="space-y-1">
                  {passwordRules.map((rule, index) => {
                    const valid = rule.test.test(newPassword);
                    return (
                      <li key={index} className="flex items-center gap-2">
                        {valid ? (
                          <Check className="text-green-500 w-4 h-4" />
                        ) : (
                          <X className="text-red-500 w-4 h-4" />
                        )}
                        <span
                          className={`${
                            valid ? "text-green-600" : "text-gray-700"
                          }`}
                        >
                          {rule.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
