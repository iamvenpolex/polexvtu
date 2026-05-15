"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Gift,
  ArrowLeft,
  User,
  Wallet,
  Mail,
  Phone,
  ShieldCheck,
  ReceiptText,
} from "lucide-react";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  balance: number;
  reward: number;
  phone: number;
  gender: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function ReadOnlyProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [showReward, setShowReward] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("User not authenticated");
        }

        const res = await axios.get<UserData>(
          `${API_BASE_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUser(res.data);
        setError("");
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch profile");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const initials = `${user?.first_name?.[0] || ""}${
    user?.last_name?.[0] || ""
  }`;

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center gap-3 px-4 py-4">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center transition hover:bg-orange-200"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-lg font-bold text-gray-800">Profile</h1>
            <p className="text-xs text-gray-500">
              Account information & wallet details
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 py-6">
        {/* LOADING */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="bg-white rounded-3xl h-40" />
            <div className="bg-white rounded-3xl h-32" />
            <div className="bg-white rounded-3xl h-48" />
          </div>
        )}

        {/* ERROR */}
        {!loading && error && !user && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-center">
            {error}
          </div>
        )}

        {/* PROFILE */}
        {!loading && user && (
          <div className="space-y-6">
            {/* PROFILE CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mb-10" />

              <div className="relative flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-2xl font-bold backdrop-blur-md">
                  {initials}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    {user.first_name} {user.last_name}
                  </h2>

                  <div className="flex items-center gap-2 text-orange-100 mt-1">
                    <ShieldCheck size={15} />
                    <span className="text-sm capitalize">{user.gender}</span>
                  </div>
                </div>
              </div>

              {/* BALANCE CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* Wallet */}
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet size={18} />
                      <p className="text-sm text-orange-100">Wallet Balance</p>
                    </div>

                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-white"
                    >
                      {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold mt-3">
                    {showBalance
                      ? `₦${Number(user.balance).toLocaleString()}`
                      : "********"}
                  </h3>
                </div>

                {/* Reward */}
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift size={18} />
                      <p className="text-sm text-orange-100">Reward Balance</p>
                    </div>

                    <button
                      onClick={() => setShowReward(!showReward)}
                      className="text-white"
                    >
                      {showReward ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold mt-3">
                    {showReward
                      ? `₦${Number(user.reward).toLocaleString()}`
                      : "********"}
                  </h3>
                </div>
              </div>
            </div>

            {/* ACCOUNT DETAILS */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">
                  Account Details
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="flex items-center gap-4 p-5">
                  <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Mail size={18} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-semibold text-gray-800 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5">
                  <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Phone size={18} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-semibold text-gray-800">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5">
                  <div className="w-11 h-11 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {user.gender}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <Link
                href="/dashboard/transactionhistory"
                className="flex items-center justify-between bg-orange-50 hover:bg-orange-100 transition rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <ReceiptText size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      Transaction History
                    </p>
                    <p className="text-sm text-gray-500">
                      View all your recent transactions
                    </p>
                  </div>
                </div>

                <ArrowLeft size={18} className="rotate-180 text-orange-600" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
