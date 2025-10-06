"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User,
  Mail,
  Phone,
  Lock,
  Users,
  Gift,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
    referral: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://polexvtu-backend-production.up.railway.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Store JWT token in localStorage
      localStorage.setItem("token", data.token);

      setMessage("✅ Registration successful! Redirecting…");

      // Redirect to dashboard after short delay
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage("❌ " + error.message);
      } else {
        setMessage("❌ Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section
        className="relative flex-1 w-full bg-fixed bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/home-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <main className="relative flex flex-col items-center justify-center py-20 px-4 z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-3xl bg-white/95 backdrop-blur-md p-8 rounded-xl shadow-lg"
          >
            <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
              Register
            </h1>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800"
            >
              {/* First Name */}
              <div className="flex items-center border rounded-lg px-3 py-2">
                <User className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-gray-800"
                />
              </div>

              {/* Last Name */}
              <div className="flex items-center border rounded-lg px-3 py-2">
                <User className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-gray-800"
                />
              </div>

              {/* Email */}
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Mail className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="me@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-gray-800"
                />
              </div>

              {/* Phone */}
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Phone className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="text"
                  name="phone"
                  placeholder="08012345678"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-gray-800"
                />
              </div>

              {/* Gender */}
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Users className="text-gray-400 w-5 h-5 mr-2" />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-800"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Referral */}
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Gift className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type="text"
                  name="referral"
                  placeholder="Referral ID (Optional)"
                  value={formData.referral}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-gray-800"
                />
              </div>

              {/* Password */}
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Lock className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Lock className="text-gray-400 w-5 h-5 mr-2" />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  {loading ? "Please wait…" : "Register"}
                </button>
              </div>
            </form>

            {/* Message */}
            {message && (
              <p
                className={`mt-4 text-center text-sm ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <p className="mt-4 text-center text-sm text-gray-600">
              Already registered?{" "}
              <a
                href="/login"
                className="text-orange-500 font-semibold hover:underline"
              >
                Login
              </a>
            </p>
          </motion.div>
        </main>
      </section>

      <Footer />
    </div>
  );
}
