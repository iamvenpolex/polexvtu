"use client";

import Navbar from "@/components/Navbar";
import { User, Mail, Phone, Lock, Users, Gift } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex flex-col items-center justify-center py-20 px-4">
        {/* Animated Container */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-md"
        >
          <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
            Register
          </h1>

          {/* Animated Form */}
          <motion.form
            className="flex flex-col gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {/* First Name */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400"
            >
              <User className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Enter Your First Name"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
            </motion.div>

            {/* Last Name */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400"
            >
              <User className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Enter Your Last Name"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
            </motion.div>

            {/* Email */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400"
            >
              <Mail className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="email"
                placeholder="adejorinayomiposi@gmail.com"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
            </motion.div>

            {/* Gender */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400"
            >
              <Users className="text-gray-400 w-5 h-5 mr-2" />
              <select className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </motion.div>

            {/* Phone Number */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400"
            >
              <Phone className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Enter Your Phone Number"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
            </motion.div>

            {/* Password */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400"
            >
              <Lock className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
            </motion.div>

            {/* Referral ID */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400"
            >
              <Gift className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Enter Referral ID (Optional)"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Register
            </motion.button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 text-center text-sm text-gray-600"
          >
            Already have an account?{" "}
            <a href="/login" className="text-orange-500 font-semibold">
              Login
            </a>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
