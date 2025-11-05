"use client";

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import { ArrowLeft, Copy, History } from "lucide-react";

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

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert(`Copied: ${text}`);
    }
  };

  // Pagination calculations
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = history.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(history.length / transactionsPerPage);

  return (
    <div className=" sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <History size={18} className="text-orange-600" />
            Tapam History
          </h1>
        </div>
      </header>

      <div className="space-y-3 mb-4 py-6">
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
              <div
                className="w-full sm:w-1/5 mt-2 sm:mt-0 flex items-center justify-end gap-1 text-gray-600 text-xs sm:text-sm cursor-pointer hover:text-orange-600 transition"
                onClick={() => copyToClipboard(item.reference)}
              >
                <span className="truncate">{item.reference}</span>
                <Copy size={14} className="flex-shrink-0" />
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
