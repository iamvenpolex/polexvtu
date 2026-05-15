"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  ArrowLeft,
  History,
  X,
  CheckCircle2,
  Clock3,
  XCircle,
  ChevronRight,
  Receipt,
  Download,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

export interface UserTransaction {
  id: number;
  reference: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  isCredit: boolean;
  message?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<UserTransaction | null>(null);

  const [copied, setCopied] = useState("");

  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const res = await axios.get<UserTransaction[]>(
          `${API_BASE_URL}/api/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setTransactions(res.data || []);
        setError("");
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Failed to fetch transactions",
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const currentTransactions = useMemo(() => {
    const indexOfLastTx = currentPage * transactionsPerPage;
    const indexOfFirstTx = indexOfLastTx - transactionsPerPage;

    return transactions.slice(indexOfFirstTx, indexOfLastTx);
  }, [transactions, currentPage]);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: <CheckCircle2 size={16} />,
        };

      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: <Clock3 size={16} />,
        };

      case "failed":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: <XCircle size={16} />,
        };

      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: <Clock3 size={16} />,
        };
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(text);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch {
      console.log("Copy failed");
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />

            <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Skeleton */}
        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>

                  <div className="h-5 w-20 bg-gray-200 rounded-full" />
                </div>

                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-red-100 text-center max-w-sm w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <XCircle className="text-red-600" size={30} />
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            Unable to Load Transactions
          </h2>

          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 active:scale-95 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <History size={18} className="text-orange-600" />
              Transaction History
            </h1>

            <p className="text-xs text-gray-500">
              View all your recent transactions
            </p>
          </div>
        </div>
      </div>

      {/* SUMMARY CARD */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Transactions</p>

              <h2 className="text-3xl font-bold mt-1">{transactions.length}</h2>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Receipt size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {currentTransactions.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
            <Receipt className="mx-auto text-gray-300 mb-3" size={50} />

            <h2 className="text-lg font-semibold text-gray-800">
              No Transactions Yet
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your transaction history will appear here.
            </p>
          </div>
        ) : (
          currentTransactions.map((tx) => {
            const status = getStatusStyles(tx.status);

            return (
              <button
                key={tx.id}
                onClick={() => setSelectedTransaction(tx)}
                className="w-full text-left bg-white rounded-3xl p-4 border border-gray-100 shadow-sm active:scale-[0.99] transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        tx.isCredit
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      <Receipt size={22} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {tx.type}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>

                      <div
                        className="flex items-center gap-1 mt-2 text-xs text-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(tx.reference);
                        }}
                      >
                        <span>Ref: {tx.reference.slice(0, 15)}...</span>

                        <Copy size={14} />

                        {copied === tx.reference && (
                          <span className="text-green-600 font-medium">
                            Copied
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold text-base ${
                        tx.isCredit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.isCredit ? "+" : "-"}₦{tx.amount.toLocaleString()}
                    </p>

                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full mt-2 text-xs font-semibold ${status.bg} ${status.text}`}
                    >
                      {status.icon}
                      {tx.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
                    View Receipt
                    <ChevronRight size={16} />
                  </div>
                </div>
              </button>
            );
          })
        )}

        {/* PAGINATION */}
        {transactions.length > 0 && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium disabled:opacity-40"
            >
              Previous
            </button>

            <div className="text-sm text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* RECEIPT MODAL */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-3xl overflow-hidden animate-slideUp">
            {/* Top */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 text-white relative">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Receipt size={28} />
                </div>

                <div>
                  <p className="text-orange-100 text-sm">Transaction Receipt</p>

                  <h2 className="text-xl font-bold capitalize">
                    {selectedTransaction.type}
                  </h2>
                </div>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-5">
              <div className="text-center">
                <p
                  className={`text-3xl font-bold ${
                    selectedTransaction.isCredit
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedTransaction.isCredit ? "+" : "-"}₦
                  {selectedTransaction.amount.toLocaleString()}
                </p>

                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full mt-3 text-xs font-semibold ${
                    getStatusStyles(selectedTransaction.status).bg
                  } ${getStatusStyles(selectedTransaction.status).text}`}
                >
                  {getStatusStyles(selectedTransaction.status).icon}

                  {selectedTransaction.status.toUpperCase()}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 text-sm">
                    Reference Number
                  </span>

                  <button
                    onClick={() =>
                      copyToClipboard(selectedTransaction.reference)
                    }
                    className="text-right font-semibold text-gray-800 text-sm flex items-center gap-1"
                  >
                    {selectedTransaction.reference}
                    <Copy size={14} />
                  </button>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 text-sm">
                    Transaction Type
                  </span>

                  <span className="font-semibold text-gray-800 text-sm capitalize">
                    {selectedTransaction.type}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 text-sm">
                    Transaction Date
                  </span>

                  <span className="font-semibold text-gray-800 text-sm text-right">
                    {new Date(selectedTransaction.created_at).toLocaleString()}
                  </span>
                </div>

                {selectedTransaction.message && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 text-sm">Message</span>

                    <span className="font-semibold text-gray-800 text-sm text-right">
                      {selectedTransaction.message}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed pt-5">
                <button className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2">
                  <Download size={18} />
                  Download Receipt
                </button>

                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="w-full mt-3 border border-gray-200 text-gray-700 py-3 rounded-2xl font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.25s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
