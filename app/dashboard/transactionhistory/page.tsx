"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";

export interface UserTransaction {
  id: number;
  reference: string;
  amount: number;
  status: string;
  created_at: string;
  type: string;
  isCredit: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await axios.get<UserTransaction[]>(
          `${API_BASE_URL}/api/transactions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTransactions(res.data);
        setError("");
      } catch (err: unknown) {
        if (axios.isAxiosError(err))
          setError(
            err.response?.data?.message || "Failed to fetch transactions"
          );
        else if (err instanceof Error) setError(err.message);
        else setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const indexOfLastTx = currentPage * transactionsPerPage;
  const indexOfFirstTx = indexOfLastTx - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTx, indexOfLastTx);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert(`Copied: ${text}`);
    }
  };

  if (loading)
    return <p className="text-center mt-6">Loading transactions...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <div className="min-h-screen p-1 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <History size={18} className="text-orange-600" />
          Transaction History
        </h1>
      </div>

      <div className="space-y-3 py-2">
        {currentTransactions.map((tx) => (
          <div
            key={tx.id}
            className="p-4 rounded-lg shadow-sm border border-gray-200 bg-gray-50 flex flex-wrap justify-between items-start"
          >
            <div className="w-full sm:w-2/5">
              <p className="text-gray-700 text-xs sm:text-sm font-medium">
                {new Date(tx.created_at).toLocaleString()}
              </p>
              <p className="mt-0.5 font-semibold text-gray-800">{tx.type}</p>
              <p
                className="text-gray-600 text-xs mt-0.5 flex items-center gap-1 cursor-pointer"
                onClick={() => copyToClipboard(tx.reference)}
              >
                Ref: {tx.reference} <Copy size={14} />
              </p>
            </div>

            <div className="w-full sm:w-1/5 mt-2 sm:mt-0 text-right">
              <span
                className={`font-bold text-sm sm:text-base ${
                  tx.isCredit ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.isCredit ? "+" : "-"}₦{tx.amount.toLocaleString()}
              </span>
            </div>

            <div className="w-full sm:w-1/5 mt-2 sm:mt-0 text-right">
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(
                  tx.status
                )}`}
              >
                {tx.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="px-3 py-1 rounded bg-orange-500 text-white text-sm disabled:bg-gray-300"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-3 py-1 rounded border border-gray-300 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-orange-500 text-white text-sm disabled:bg-gray-300"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
