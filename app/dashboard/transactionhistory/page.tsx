"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  History,
  X,
  CheckCircle2,
  Clock3,
  XCircle,
  Receipt,
  Download,
  Smartphone,
  Wifi,
  Gift,
  ChevronRight,
  UserRound,
  Hash,
  CalendarDays,
  MessageSquare,
  CircleDollarSign,
} from "lucide-react";

interface Transaction {
  id: number;
  reference: string;
  type?: string;
  amount: number;
  status: string;
  created_at: string;

  isCredit: boolean;

  message?: string;
  phone?: string | number;
  network?: string | number;
  description?: string;

  sender_name?: string;
  receiver_name?: string;

  source?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [copied, setCopied] = useState("");

  const transactionsPerPage = 10;

  /*
   * ==========================================================
   * FETCH TRANSACTIONS
   * ==========================================================
   */

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [normalResponse, tapamResponse] = await Promise.all([
          axios.get<Transaction[]>(`${API_BASE_URL}/api/transactions`, {
            headers,
          }),

          axios.get<Transaction[]>(`${API_BASE_URL}/api/transactions/tapam`, {
            headers,
          }),
        ]);

        const normalTransactions = normalResponse.data || [];

        const tapamTransactions = (tapamResponse.data || []).filter(
          (tx) => tx.source === "tapam" || tx.source === "reward",
        );

        /*
         * Join both transaction lists.
         */
        const combined = [...normalTransactions, ...tapamTransactions];

        /*
         * Remove duplicates.
         */
        const uniqueTransactions = Array.from(
          new Map(
            combined.map((tx) => [`${tx.id}-${tx.reference}`, tx]),
          ).values(),
        );

        /*
         * Newest first.
         */
        uniqueTransactions.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setTransactions(uniqueTransactions);
        setError("");
      } catch (err: unknown) {
        console.error("Error fetching transactions:", err);

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

  /*
   * ==========================================================
   * FORMATTERS
   * ==========================================================
   */

  const formatCurrency = (amount: number) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  /*
   * ==========================================================
   * COPY
   * ==========================================================
   */

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

  /*
   * ==========================================================
   * STATUS
   * ==========================================================
   */

  const getStatus = (status?: string) => {
    const normalized = (status || "").toLowerCase().trim();

    switch (normalized) {
      case "success":
      case "successful":
      case "completed":
      case "complete":
        return {
          label: "Successful",
          bg: "bg-green-100",
          text: "text-green-700",
          icon: <CheckCircle2 size={15} />,
        };

      case "pending":
      case "processing":
      case "in_progress":
        return {
          label: "Pending",
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: <Clock3 size={15} />,
        };

      case "failed":
      case "failure":
      case "cancelled":
      case "canceled":
        return {
          label: "Failed",
          bg: "bg-red-100",
          text: "text-red-700",
          icon: <XCircle size={15} />,
        };

      default:
        return {
          label: status || "Unknown",
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: <Clock3 size={15} />,
        };
    }
  };

  /*
   * ==========================================================
   * TRANSACTION TYPE
   * ==========================================================
   */

  const getTransactionType = (tx: Transaction) => {
    const text = `
      ${tx.type || ""}
      ${tx.description || ""}
      ${tx.message || ""}
      ${tx.source || ""}
    `.toLowerCase();

    if (text.includes("cashback") || text.includes("cash back")) {
      return {
        label: "Cashback",
        icon: <CircleDollarSign size={21} />,
        bg: "bg-green-100",
        color: "text-green-600",
      };
    }

    if (text.includes("reward") || tx.source === "reward") {
      return {
        label: "Reward",
        icon: <Gift size={21} />,
        bg: "bg-green-100",
        color: "text-green-600",
      };
    }

    if (text.includes("airtime") || text.includes("recharge")) {
      return {
        label: "Airtime",
        icon: <Smartphone size={21} />,
        bg: "bg-blue-100",
        color: "text-blue-600",
      };
    }

    if (text.includes("data") || text.includes("bundle")) {
      return {
        label: "Data",
        icon: <Wifi size={21} />,
        bg: "bg-purple-100",
        color: "text-purple-600",
      };
    }

    if (text.includes("tapam") || text.includes("transfer")) {
      return {
        label: tx.source === "tapam" ? "TapAm Transfer" : "Transfer",
        icon: tx.isCredit ? (
          <ArrowDownLeft size={21} />
        ) : (
          <ArrowUpRight size={21} />
        ),
        bg: tx.isCredit ? "bg-green-100" : "bg-orange-100",
        color: tx.isCredit ? "text-green-600" : "text-orange-600",
      };
    }

    return {
      label: tx.type || "Transaction",
      icon: <Receipt size={21} />,
      bg: tx.isCredit ? "bg-green-100" : "bg-orange-100",
      color: tx.isCredit ? "text-green-600" : "text-orange-600",
    };
  };

  /*
   * ==========================================================
   * CASHBACK / REWARD
   * ==========================================================
   */

  const isCashback = (tx: Transaction) => {
    const text = `
      ${tx.type || ""}
      ${tx.description || ""}
      ${tx.message || ""}
      ${tx.source || ""}
    `.toLowerCase();

    return text.includes("cashback") || text.includes("cash back");
  };

  const isReward = (tx: Transaction) => {
    return (
      tx.source === "reward" ||
      (tx.description || "").toLowerCase().includes("reward")
    );
  };

  const isPositiveTransaction = (tx: Transaction) => {
    return tx.isCredit || isCashback(tx) || isReward(tx);
  };

  /*
   * ==========================================================
   * PAGINATION
   * ==========================================================
   */

  const totalPages = Math.max(
    1,
    Math.ceil(transactions.length / transactionsPerPage),
  );

  const currentTransactions = useMemo(() => {
    const last = currentPage * transactionsPerPage;

    const first = last - transactionsPerPage;

    return transactions.slice(first, last);
  }, [transactions, currentPage]);

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

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />

            <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
          </div>
        </header>

        <div className="max-w-3xl mx-auto p-4 space-y-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm animate-pulse"
            >
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-200" />

                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />

                    <div className="h-3 w-24 bg-gray-200 rounded" />

                    <div className="h-3 w-28 bg-gray-200 rounded" />
                  </div>
                </div>

                <div className="space-y-2 flex flex-col items-end">
                  <div className="h-5 w-20 bg-gray-200 rounded" />

                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * ERROR
   * ==========================================================
   */

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

  /*
   * ==========================================================
   * MAIN PAGE
   * ==========================================================
   */

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* HEADER */}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 active:scale-95 transition"
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
            const status = getStatus(tx.status);
            const type = getTransactionType(tx);
            const positive = isPositiveTransaction(tx);

            return (
              <button
                key={`${tx.id}-${tx.reference}`}
                type="button"
                onClick={() => setSelectedTransaction(tx)}
                className="w-full text-left bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.99] transition"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* LEFT */}

                  <div className="flex gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${type.bg} ${type.color}`}
                    >
                      {type.icon}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {type.label}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(tx.created_at)}
                      </p>

                      {/* PHONE */}

                      {tx.phone !== undefined &&
                        tx.phone !== null &&
                        String(tx.phone).trim() !== "" && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                            <Smartphone size={13} />

                            <span>{String(tx.phone)}</span>
                          </div>
                        )}

                      {/* RECIPIENT */}

                      {tx.receiver_name && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600">
                          <UserRound size={13} />

                          <span className="truncate">{tx.receiver_name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="text-right shrink-0">
                    <p
                      className={`font-bold text-base ${
                        positive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {positive ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>

                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full mt-2 text-[11px] font-semibold ${status.bg} ${status.text}`}
                    >
                      {status.icon}

                      {status.label}
                    </div>
                  </div>
                </div>

                {/* BOTTOM */}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div
                    className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0"
                    onClick={(event) => {
                      event.stopPropagation();

                      copyToClipboard(tx.reference);
                    }}
                  >
                    <Hash size={13} />

                    <span className="truncate max-w-[170px]">
                      {tx.reference}
                    </span>

                    <Copy size={13} className="text-orange-600 shrink-0" />

                    {copied === tx.reference && (
                      <span className="text-green-600 font-medium">Copied</span>
                    )}
                  </div>

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
              type="button"
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
              type="button"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          RECEIPT MODAL
          ===================================================== */}

      {selectedTransaction && (
        <ReceiptModal
          transaction={selectedTransaction}
          copied={copied}
          onClose={() => setSelectedTransaction(null)}
          onCopy={copyToClipboard}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}

      {/* ANIMATION */}

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

/*
 * ============================================================
 * RECEIPT MODAL
 * ============================================================
 */

interface ReceiptModalProps {
  transaction: Transaction;
  copied: string;
  onClose: () => void;
  onCopy: (text: string) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

function ReceiptModal({
  transaction,
  copied,
  onClose,
  onCopy,
  formatCurrency,
  formatDate,
}: ReceiptModalProps) {
  const status = getStatusStatic(transaction.status);

  const type = getTransactionTypeStatic(transaction);

  const positive =
    transaction.isCredit ||
    isCashbackStatic(transaction) ||
    isRewardStatic(transaction);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-[32px] sm:rounded-3xl overflow-hidden max-h-[92vh] overflow-y-auto animate-slideUp">
        {/* HEADER */}

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              {type.icon}
            </div>

            <div>
              <p className="text-orange-100 text-sm">Transaction Receipt</p>

              <h2 className="text-xl font-bold">{type.label}</h2>
            </div>
          </div>
        </div>

        {/* BODY */}

        <div className="p-6">
          {/* AMOUNT */}

          <div className="text-center pb-6">
            <p
              className={`text-4xl font-bold ${
                positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {positive ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-3 text-xs font-semibold ${status.bg} ${status.text}`}
            >
              {status.icon}

              {status.label}
            </div>
          </div>

          {/* DETAILS */}

          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <ReceiptRow
              icon={<Receipt size={16} />}
              label="Transaction Type"
              value={type.label}
            />

            {/* RECIPIENT NUMBER */}

            {transaction.phone !== undefined &&
              transaction.phone !== null &&
              String(transaction.phone).trim() !== "" && (
                <ReceiptRow
                  icon={<Smartphone size={16} />}
                  label="Recipient Number"
                  value={String(transaction.phone)}
                />
              )}

            {/* NETWORK */}

            {transaction.network !== undefined &&
              transaction.network !== null &&
              String(transaction.network).trim() !== "" && (
                <ReceiptRow
                  icon={<Wifi size={16} />}
                  label="Network"
                  value={String(transaction.network)}
                />
              )}

            {/* SENDER */}

            {transaction.sender_name && (
              <ReceiptRow
                icon={<UserRound size={16} />}
                label="Sender"
                value={transaction.sender_name}
              />
            )}

            {/* RECEIVER */}

            {transaction.receiver_name && (
              <ReceiptRow
                icon={<UserRound size={16} />}
                label="Recipient"
                value={transaction.receiver_name}
              />
            )}

            {/* DESCRIPTION */}

            {(transaction.message || transaction.description) && (
              <ReceiptRow
                icon={<MessageSquare size={16} />}
                label="Description"
                value={transaction.message || transaction.description || ""}
              />
            )}

            {/* DATE */}

            <ReceiptRow
              icon={<CalendarDays size={16} />}
              label="Transaction Date"
              value={formatDate(transaction.created_at)}
            />

            {/* REFERENCE */}

            <div className="flex items-start justify-between gap-4 px-4 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-sm shrink-0">
                <Hash size={16} />

                <span>Reference</span>
              </div>

              <button
                type="button"
                onClick={() => onCopy(transaction.reference)}
                className="flex items-center gap-1.5 text-right text-sm font-semibold text-orange-600 break-all"
              >
                <span>
                  {copied === transaction.reference
                    ? "Copied"
                    : transaction.reference}
                </span>

                <Copy size={14} className="shrink-0" />
              </button>
            </div>
          </div>

          {/* SUMMARY */}

          <div className="mt-5 bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Amount</span>

              <span
                className={`font-semibold ${
                  positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {positive ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">Status</span>

              <span className={`text-sm font-semibold ${status.text}`}>
                {status.label}
              </span>
            </div>
          </div>

          {/* BUTTONS */}

          <div className="border-t border-dashed mt-5 pt-5">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download / Print Receipt
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-3 border border-gray-200 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-5">
            Keep this receipt for your records.
          </p>
        </div>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * RECEIPT ROW
 * ============================================================
 */

interface ReceiptRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function ReceiptRow({ icon, label, value }: ReceiptRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-4 border-t border-gray-100 first:border-t-0">
      <div className="flex items-center gap-2 text-gray-500 text-sm shrink-0">
        {icon}

        <span>{label}</span>
      </div>

      <span className="text-sm font-semibold text-gray-800 text-right break-words">
        {value}
      </span>
    </div>
  );
}

/*
 * ============================================================
 * STATIC HELPERS
 * ============================================================
 *
 * These are outside the component so the receipt modal
 * does not depend on functions recreated inside the page.
 */

function getStatusStatic(status?: string) {
  const normalized = (status || "").toLowerCase().trim();

  switch (normalized) {
    case "success":
    case "successful":
    case "completed":
    case "complete":
      return {
        label: "Successful",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: <CheckCircle2 size={15} />,
      };

    case "pending":
    case "processing":
    case "in_progress":
      return {
        label: "Pending",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: <Clock3 size={15} />,
      };

    case "failed":
    case "failure":
    case "cancelled":
    case "canceled":
      return {
        label: "Failed",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <XCircle size={15} />,
      };

    default:
      return {
        label: status || "Unknown",
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: <Clock3 size={15} />,
      };
  }
}

function getTransactionTypeStatic(tx: Transaction) {
  const text = `
    ${tx.type || ""}
    ${tx.description || ""}
    ${tx.message || ""}
    ${tx.source || ""}
  `.toLowerCase();

  if (text.includes("cashback") || text.includes("cash back")) {
    return {
      label: "Cashback",
      icon: <CircleDollarSign size={21} />,
    };
  }

  if (text.includes("reward") || tx.source === "reward") {
    return {
      label: "Reward",
      icon: <Gift size={21} />,
    };
  }

  if (text.includes("airtime") || text.includes("recharge")) {
    return {
      label: "Airtime",
      icon: <Smartphone size={21} />,
    };
  }

  if (text.includes("data") || text.includes("bundle")) {
    return {
      label: "Data",
      icon: <Wifi size={21} />,
    };
  }

  if (text.includes("tapam") || text.includes("transfer")) {
    return {
      label: tx.source === "tapam" ? "TapAm Transfer" : "Transfer",
      icon: tx.isCredit ? (
        <ArrowDownLeft size={21} />
      ) : (
        <ArrowUpRight size={21} />
      ),
    };
  }

  return {
    label: tx.type || "Transaction",
    icon: <Receipt size={21} />,
  };
}

function isCashbackStatic(tx: Transaction) {
  const text = `
    ${tx.type || ""}
    ${tx.description || ""}
    ${tx.message || ""}
    ${tx.source || ""}
  `.toLowerCase();

  return text.includes("cashback") || text.includes("cash back");
}

function isRewardStatic(tx: Transaction) {
  return (
    tx.source === "reward" ||
    (tx.description || "").toLowerCase().includes("reward")
  );
}
