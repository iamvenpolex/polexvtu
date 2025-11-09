"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Gift, ArrowLeft, User } from "lucide-react";
import Link from "next/link";

interface User {
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
  const [user, setUser] = useState<User | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [showReward, setShowReward] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await axios.get<User>(`${API_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setError("");
      } catch (err: unknown) {
        if (axios.isAxiosError(err))
          setError(err.response?.data?.message || "Failed to fetch data");
        else if (err instanceof Error) setError(err.message);
        else setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-1 sm:p-6">
      <div className="max-w-lg sm:max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User size={18} className="text-orange-600" />
            Profile Information
          </h1>
        </div>

        {loading && (
          <p className="text-center text-gray-500 mt-6">Loading profile...</p>
        )}
        {!loading && !user && error && (
          <p className="text-center text-red-500 mt-4">{error}</p>
        )}

        {user && (
          <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                {user.first_name[0]}
                {user.last_name[0]}
              </div>
              <div>
                <p className="text-gray-500 text-sm">Full Name</p>
                <p className="text-gray-800 font-medium">
                  {user.first_name} {user.last_name}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-gray-800 font-medium break-words">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <p className="text-gray-800 font-medium break-words">
                {user.phone}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Gender</p>
              <p className="text-gray-800 font-medium break-words">
                {user.gender}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-gray-500 text-sm">Wallet Balance</p>
                <p className="text-gray-800 font-medium flex items-center gap-2">
                  {showBalance ? `₦${user.balance.toLocaleString()}` : "****"}
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Reward Balance</p>
                <p className="text-green-600 font-semibold flex items-center gap-2">
                  {showReward ? `₦${user.reward.toLocaleString()}` : "****"}
                  <button
                    onClick={() => setShowReward(!showReward)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showReward ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <Gift size={16} />
                </p>
              </div>
            </div>

            {/* Link to Transactions Page */}
            <Link
              href="/dashboard/transactionhistory"
              className="text-blue-600 hover:underline mt-4 inline-block"
            >
              View Transaction History
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
