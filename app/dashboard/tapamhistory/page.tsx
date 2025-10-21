"use client";

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface TapamHistory {
  id: number;
  reference: string;
  amount: number;
  status: string;
  created_at: string;
  sender_name: string;
  receiver_name: string;
  description: string;
  isCredit: boolean;
  source?: string;
}

export default function TapamHistoryPage() {
  const [history, setHistory] = useState<TapamHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTapamHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response: AxiosResponse<TapamHistory[]> = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions/tapam`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const filtered = response.data.filter(
          (tx) => tx.source === "tapam" || tx.source === "reward"
        );

        setHistory(filtered);
      } catch (err) {
        console.error("❌ Error fetching TapAm history:", err);
        setError("Failed to load TapAm and Reward history");
      } finally {
        setLoading(false);
      }
    };

    fetchTapamHistory();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading TapAm history...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );

  if (!history.length)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">
          No TapAm or Reward history found
        </p>
      </div>
    );

  // Pagination calculations
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = history.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(history.length / transactionsPerPage);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-orange-600 text-center">
        TapAm & Reward History
      </h1>

      <div className="space-y-3">
        {currentTransactions.map((item) => (
          <div
            key={item.id}
            className="p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 bg-gray-50"
          >
            <div className="flex justify-between items-start flex-wrap">
              <div className="w-full sm:w-2/5">
                <p className="text-gray-700 text-xs sm:text-sm font-medium">
                  {new Date(item.created_at).toLocaleString()}
                </p>
                <p className="mt-0.5 font-semibold text-gray-800">
                  {item.description.includes("Reward")
                    ? "Reward → Wallet"
                    : item.description}
                </p>
                {item.source === "tapam" &&
                  item.sender_name !== item.receiver_name && (
                    <p className="text-gray-600 text-xs mt-0.5">
                      From: {item.sender_name} <br />
                      To: {item.receiver_name}
                    </p>
                  )}
              </div>
              <div className="w-full sm:w-1/5 mt-2 sm:mt-0 text-right">
                <span
                  className={`font-bold text-sm sm:text-base ${
                    item.isCredit ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.isCredit ? "+" : "-"}₦
                  {Number(item.amount).toLocaleString()}
                </span>
              </div>
              <div className="w-full sm:w-1/5 mt-2 sm:mt-0 text-right">
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    item.status === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.status.toUpperCase()}
                </span>
              </div>
              <div className="w-full sm:w-1/5 mt-2 sm:mt-0 text-right text-gray-500 text-xs sm:text-sm">
                {item.reference}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="px-2 py-1 rounded bg-orange-500 text-white text-sm disabled:bg-gray-300"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-2 py-1 rounded border border-gray-300 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-2 py-1 rounded bg-orange-500 text-white text-sm disabled:bg-gray-300"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
