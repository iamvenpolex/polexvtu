"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Gift } from "lucide-react";
import Link from "next/link";
import TransactionTable, { UserTransaction } from "./TransactionTable/page";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  balance: number;
  reward: number;
}

export default function ReadOnlyProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [showBalance, setShowBalance] = useState(true);
  const [showReward, setShowReward] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 6;
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const profileRes = await axios.get<User>(
          "http://localhost:5000/api/user/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(profileRes.data);

        const txRes = await axios.get<UserTransaction[]>(
          "http://localhost:5000/api/transactions",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(txRes.data);

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

    fetchData();
  }, []);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-lg sm:max-w-2xl mx-auto space-y-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-block text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {loading && (
          <p className="text-center text-gray-500 mt-6">Loading profile...</p>
        )}
        {!loading && !user && error && (
          <p className="text-center text-red-500 mt-4">{error}</p>
        )}

        {user && (
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Profile Information
            </h2>
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
          </div>
        )}

        {user && (
          <TransactionTable
            transactions={transactions}
            currentPage={currentPage}
            transactionsPerPage={transactionsPerPage}
            totalPages={totalPages}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}
      </div>
    </div>
  );
}
