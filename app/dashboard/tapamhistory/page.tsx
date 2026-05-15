"use client";

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  History,
  X,
  CheckCircle2,
  Clock3,
  XCircle,
  Gift,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<TapamHistory | null>(null);
  const [copied, setCopied] = useState("");

  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTapamHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response: AxiosResponse<TapamHistory[]> = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transactions/tapam`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const filtered = response.data.filter(
          (tx) => tx.source === "tapam" || tx.source === "reward",
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

  const getStatusUI = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return {
          color: "bg-green-100 text-green-700",
          icon: <CheckCircle2 size={14} />,
        };

      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700",
          icon: <Clock3 size={14} />,
        };

      case "failed":
        return {
          color: "bg-red-100 text-red-700",
          icon: <XCircle size={14} />,
        };

      default:
        return {
          color: "bg-gray-100 text-gray-700",
          icon: <Clock3 size={14} />,
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${Number(amount).toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = history.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(history.length / transactionsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-3 w-24 rounded bg-gray-200" />
                </div>

                <div className="space-y-2 flex flex-col items-end">
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="h-6 w-16 rounded-full bg-gray-200" />
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
        <div className="bg-white border border-red-200 rounded-2xl p-6 text-center max-w-sm w-full shadow-sm">
          <XCircle className="mx-auto text-red-500 mb-3" size={42} />

          <h2 className="text-lg font-semibold text-gray-800">
            Unable to Load
          </h2>

          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center gap-3 px-4 py-4">
            <Link
              href="/dashboard"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600"
            >
              <ArrowLeft size={18} />
            </Link>

            <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <History size={18} className="text-orange-500" />
              Tapam History
            </h1>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center py-24 px-4">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <Gift className="text-orange-500" size={34} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            No Transactions Yet
          </h2>

          <p className="text-sm text-gray-500 text-center mt-1">
            Your Tapam and reward transfer history will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <History size={18} className="text-orange-500" />
              Tapam History
            </h1>

            <p className="text-xs text-gray-500">
              View all Tapam and reward transactions
            </p>
          </div>
        </div>
      </header>

      {/* LIST */}
      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {currentTransactions.map((item) => {
          const statusUI = getStatusUI(item.status);

          return (
            <button
              key={item.id}
              onClick={() => setSelectedTx(item)}
              className="w-full text-left bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                {/* LEFT */}
                <div className="flex gap-3 flex-1 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      item.isCredit
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.isCredit ? (
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.description.includes("Reward")
                        ? "Reward Transfer"
                        : "Tapam Transfer"}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(item.created_at)}
                    </p>

                    {item.source === "tapam" &&
                      item.sender_name !== item.receiver_name && (
                        <div className="mt-2 text-xs text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">From:</span>{" "}
                            {item.sender_name}
                          </p>

                          <p>
                            <span className="font-medium">To:</span>{" "}
                            {item.receiver_name}
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right shrink-0">
                  <p
                    className={`font-bold text-base ${
                      item.isCredit ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.isCredit ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </p>

                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium mt-2 ${statusUI.color}`}
                  >
                    {statusUI.icon}
                    {item.status.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* REF */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 truncate">
                  Ref: {item.reference}
                </p>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(item.reference);
                  }}
                  className="flex items-center gap-1 text-xs text-orange-600 font-medium cursor-pointer"
                >
                  <Copy size={14} />
                  {copied === item.reference ? "Copied" : "Copy"}
                </div>
              </div>
            </button>
          );
        })}

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium disabled:bg-gray-300"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700">
            {currentPage} / {totalPages}
          </div>

          <button
            className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium disabled:bg-gray-300"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* RECEIPT MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slideUp">
            {/* TOP */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-6 text-white relative">
              <button
                onClick={() => setSelectedTx(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    selectedTx.isCredit ? "bg-white/20" : "bg-black/10"
                  }`}
                >
                  {selectedTx.isCredit ? (
                    <ArrowDownLeft size={26} />
                  ) : (
                    <ArrowUpRight size={26} />
                  )}
                </div>

                <div>
                  <p className="text-sm opacity-90">Transaction Receipt</p>

                  <h2 className="text-2xl font-bold">
                    {selectedTx.isCredit ? "+" : "-"}
                    {formatCurrency(selectedTx.amount)}
                  </h2>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Status</span>

                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    getStatusUI(selectedTx.status).color
                  }`}
                >
                  {getStatusUI(selectedTx.status).icon}
                  {selectedTx.status.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500 text-sm">Reference</span>

                <button
                  onClick={() => copyToClipboard(selectedTx.reference)}
                  className="flex items-center gap-1 text-sm font-medium text-orange-600"
                >
                  <span className="truncate max-w-[180px]">
                    {selectedTx.reference}
                  </span>

                  <Copy size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Transaction Type</span>

                <span className="text-sm font-medium text-gray-800">
                  {selectedTx.description.includes("Reward")
                    ? "Reward Transfer"
                    : "Tapam Transfer"}
                </span>
              </div>

              {selectedTx.source === "tapam" &&
                selectedTx.sender_name !== selectedTx.receiver_name && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">From</span>

                      <span className="text-sm font-medium text-gray-800">
                        {selectedTx.sender_name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">To</span>

                      <span className="text-sm font-medium text-gray-800">
                        {selectedTx.receiver_name}
                      </span>
                    </div>
                  </>
                )}

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Date</span>

                <span className="text-sm font-medium text-gray-800 text-right">
                  {formatDate(selectedTx.created_at)}
                </span>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-center text-gray-500">
                  This receipt serves as confirmation of your transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
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
