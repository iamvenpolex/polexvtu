"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InfoTicker from "@/components/InfoTicker";

type LoginResponse = {
  token: string;
  firstName: string;
  email: string;
  user_id: number;
};

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://polexvtu-backend.onrender.com";

  // ✅ Wake up the backend server silently on page load
  useEffect(() => {
    const wakeServer = async () => {
      try {
        await axios.get(`${API_BASE_URL}/api/ping`);
      } catch {
        // Ignore wakeup errors
      }
    };
    wakeServer();
  }, [API_BASE_URL]);

  // ✅ Function to attempt login (used in retry)
  const attemptLogin = async (): Promise<boolean> => {
    try {
      const res = await axios.post<LoginResponse>(
        `${API_BASE_URL}/api/auth/login`,
        { identifier, password },
        { timeout: 8000 }
      );

      const { token, firstName, email, user_id } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("email", email);
      localStorage.setItem("user_id", String(user_id));

      setMessage("✅ Login successful!");
      router.push("/dashboard");
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (
          err.code === "ECONNABORTED" ||
          err.message.includes("Network Error")
        ) {
          return false; // Backend might be waking up
        }
        setMessage(err.response?.data?.message || "❌ Login failed");
      } else {
        setMessage("❌ Something went wrong");
      }
      return false;
    }
  };

  // ✅ Handle login with retry if server is sleeping
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let success = await attemptLogin();
    let retryCount = 0;

    while (!success && retryCount < 5) {
      // Retry every 3 seconds
      await new Promise((r) => setTimeout(r, 3000));
      retryCount++;
      success = await attemptLogin();
    }

    if (!success && retryCount >= 5) {
      setMessage("⚙️ Please try again shortly.");
    }

    setLoading(false);
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
          className="relative z-10 w-10/10 max-w-md bg-white p-5 rounded-xl shadow-lg"
        >
          <InfoTicker message="🔥 Special VTU Offer: Get 50% OFF on your first recharge! Limited time only! 🔥" />
          <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
            Login
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email or Phone */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Email or Phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error / Success Message */}
            {message && (
              <p
                className={`text-center text-sm ${
                  message.startsWith("✅")
                    ? "text-green-600"
                    : message.startsWith("⚙️")
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            <a
              href="/forgot-password"
              className="text-blue-600 font-semibold hover:underline"
            >
              Forgot Password?
            </a>
          </p>

          <p className="mt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-orange-500 font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
