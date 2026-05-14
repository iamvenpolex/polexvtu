"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function VerifyCodePage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);

  const router = useRouter();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://polexvtu-backend.onrender.com";

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/forgot-password");
    }
  }, [router]);

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
  };

  const triggerError = (msg: string) => {
    setMessage(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];

    // handle paste
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      digits.forEach((d, i) => (newCode[i] = d));
      setCode(newCode);

      const next = digits.length < 6 ? digits.length : 5;
      focusInput(next);
      return;
    }

    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      focusInput(index + 1);
    }

    // AUTO SUBMIT WHEN COMPLETE
    if (newCode.every((d) => d !== "")) {
      setTimeout(() => handleSubmit(newCode.join("")), 150);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handleSubmit = async (finalCode?: string) => {
    const otp = finalCode || code.join("");

    if (otp.length !== 6 || loading) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/forgot-password/verify-code`,
        {
          emailOrPhone: email,
          code: otp,
        },
      );

      if (res.data.success) {
        localStorage.setItem("resetCode", otp);
        router.push("/reset-password");
      } else {
        triggerError(res.data.message || "Verification failed.");
      }
    } catch {
      triggerError("Something went wrong. Please try again.");
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
          animate={{
            opacity: 1,
            y: 0,
            x: shake ? [-6, 6, -6, 6, 0] : 0,
          }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md bg-white p-6 rounded-xl shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center text-blue-900 mb-3">
            Verify Reset Code
          </h1>

          <p className="text-center text-gray-600 mb-6 text-sm">
            Enter the 6-digit code sent to your email
          </p>

          {/* EMAIL */}
          <input
            type="email"
            value={email}
            readOnly
            className="w-full px-4 py-2 border bg-gray-100 text-black rounded-lg mb-5"
          />

          {/* OTP BOXES */}
          <div className="flex justify-between gap-2 mb-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                disabled={loading}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-black disabled:opacity-50"
              />
            ))}
          </div>

          {/* MESSAGE */}
          {message && (
            <p className="text-center text-sm text-red-600 mb-3">{message}</p>
          )}

          {/* BUTTON */}
          <button
            onClick={() => handleSubmit()}
            disabled={loading}
            className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

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
