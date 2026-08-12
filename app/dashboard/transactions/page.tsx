"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Hash,
  History,
  Receipt,
  XCircle,
} from "lucide-react";

export interface UserTransaction {
  id: number;
  reference: string;
  provider_reference?: string | null;
  api_reference?: string | null;

  type: string;
  amount: number;
  status: string;
  refunded?: boolean | null;

  created_at: string;

  phone?: string | number | null;
  network?: string | number | null;

  description?: string | null;
  message?: string | null;

  balance_before?: number | null;
  balance_after?: number | null;

  isCredit: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const TRANSACTIONS_PER_PAGE = 10;

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User not authenticated");
          return;
        }

        const response = await axios.get<UserTransaction[]>(
          `${API_BASE_URL}/api/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setTransactions(response.data || []);
        setError("");
      } catch (err: unknown) {
        console.error("Failed to fetch transactions:", err);

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(text);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "successful":
      case "completed":
      case "complete":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: <CheckCircle2 size={15} />,
          label: "SUCCESSFUL",
        };

      case "pending":
      case "processing":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: <Clock3 size={15} />,
          label: "PENDING",
        };

      case "failed":
      case "failure":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: <XCircle size={15} />,
          label: "FAILED",
        };

      case "refunded":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          icon: <CheckCircle2 size={15} />,
          label: "REFUNDED",
        };

      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: <Clock3 size={15} />,
          label: status?.toUpperCase() || "UNKNOWN",
        };
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getTransactionName = (tx: UserTransaction) => {
    const type = tx.type?.toLowerCase() || "";

    if (type.includes("cashback") || type === "cashback") {
      return "Cashback";
    }

    if (type.includes("airtime")) {
      return "Airtime";
    }

    if (type.includes("data")) {
      return "Data Purchase";
    }

    if (type.includes("electricity") || type.includes("bill")) {
      return "Bill Payment";
    }

    return tx.type ? tx.type.replace(/[-_]/g, " ") : "Transaction";
  };

  const totalPages = Math.max(
    1,
    Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE),
  );

  const currentTransactions = useMemo(() => {
    const indexOfLast = currentPage * TRANSACTIONS_PER_PAGE;

    const indexOfFirst = indexOfLast - TRANSACTIONS_PER_PAGE;

    return transactions.slice(indexOfFirst, indexOfLast);
  }, [transactions, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="animate-pulse">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-200" />

                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="h-3 w-full bg-gray-200 rounded" />
                </div>
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
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100 text-center max-w-sm w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <XCircle className="text-red-600" size={30} />
          </div>

          <h2 className="text-lg font-bold text-gray-800">
            Unable to Load Transactions
          </h2>

          <p className="text-sm text-gray-500 mt-2">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
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

            <p className="text-xs text-gray-500">View all your transactions</p>
          </div>
        </div>
      </header>

      {/* SUMMARY */}
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

            const isCashback =
              tx.type?.toLowerCase() === "cashback" ||
              tx.type?.toLowerCase().includes("cashback");

            return (
              <div
                key={tx.id}
                className="w-full bg-white rounded-3xl p-4 border border-gray-100 shadow-sm transition hover:shadow-md"
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        tx.isCredit || isCashback
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {isCashback ? (
                        <Receipt size={22} />
                      ) : (
                        <Receipt size={22} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 capitalize truncate">
                        {getTransactionName(tx)}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(tx.created_at)}
                      </p>

                      {tx.phone && (
                        <p className="text-xs text-gray-500 mt-1">
                          {String(tx.phone)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* AMOUNT + STATUS */}
                  <div className="text-right shrink-0">
                    <p
                      className={`font-bold text-base ${
                        tx.isCredit || isCashback
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.isCredit || isCashback ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>

                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full mt-2 text-xs font-semibold ${status.bg} ${status.text}`}
                    >
                      {status.icon}
                      {status.label}
                    </div>
                  </div>
                </div>

                {/* REFERENCE + RECEIPT */}
                <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(tx.reference)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0 hover:text-gray-700"
                  >
                    <Hash size={13} className="shrink-0" />

                    <span className="truncate max-w-[170px]">
                      {tx.reference}
                    </span>

                    <Copy size={13} className="text-orange-600 shrink-0" />

                    {copied === tx.reference && (
                      <span className="text-green-600 font-medium shrink-0">
                        Copied
                      </span>
                    )}
                  </button>

                  <Link
                    href={`dashboard/transactions/receipt/${encodeURIComponent(
                      tx.reference,
                    )}`}
                    className="flex items-center gap-1 text-sm text-orange-600 font-semibold hover:text-orange-700 shrink-0"
                  >
                    View Receipt
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })
        )}

        {/* PAGINATION */}
        {transactions.length > 0 && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium disabled:opacity-40"
            >
              Previous
            </button>

            <div className="text-sm text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
