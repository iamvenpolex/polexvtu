"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Copy,
  Hash,
  Phone,
  Receipt,
  Smartphone,
  Wallet,
  XCircle,
} from "lucide-react";

interface UserTransaction {
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

export default function ReceiptPage() {
  const params = useParams();

  const reference = decodeURIComponent(String(params.reference || ""));

  const [transaction, setTransaction] = useState<UserTransaction | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const fetchTransaction = async () => {
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

        const found = (response.data || []).find(
          (tx) => tx.reference === reference,
        );

        if (!found) {
          setError("Transaction not found");
          return;
        }

        setTransaction(found);
      } catch (err: unknown) {
        console.error("Failed to load transaction:", err);

        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load receipt");
        } else {
          setError("Failed to load receipt");
        }
      } finally {
        setLoading(false);
      }
    };

    if (reference) {
      fetchTransaction();
    } else {
      setError("Invalid transaction reference");
      setLoading(false);
    }
  }, [reference]);

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

  const formatCurrency = (amount: number | null | undefined) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-NG", {
      dateStyle: "long",
      timeStyle: "short",
    });
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
          icon: <CheckCircle2 size={17} />,
          label: "SUCCESSFUL",
        };

      case "pending":
      case "processing":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: <Clock3 size={17} />,
          label: "PENDING",
        };

      case "failed":
      case "failure":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: <XCircle size={17} />,
          label: "FAILED",
        };

      case "refunded":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          icon: <CheckCircle2 size={17} />,
          label: "REFUNDED",
        };

      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: <Clock3 size={17} />,
          label: status?.toUpperCase() || "UNKNOWN",
        };
    }
  };

  const getTransactionName = (tx: UserTransaction) => {
    const type = tx.type?.toLowerCase() || "";

    if (type === "cashback" || type.includes("cashback")) {
      return "Cashback";
    }

    if (type.includes("airtime")) {
      return "Airtime Purchase";
    }

    if (type.includes("data")) {
      return "Data Purchase";
    }

    if (type.includes("electricity") || type.includes("bill")) {
      return "Bill Payment";
    }

    return tx.type ? tx.type.replace(/[-_]/g, " ") : "Transaction";
  };

  const isCashback =
    transaction?.type?.toLowerCase() === "cashback" ||
    transaction?.type?.toLowerCase().includes("cashback");

  const status = transaction ? getStatusStyles(transaction.status) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-200" />

            <div className="p-6 space-y-5">
              <div className="h-10 w-40 bg-gray-200 rounded mx-auto" />
              <div className="h-8 w-28 bg-gray-200 rounded-full mx-auto" />

              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex justify-between">
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                  <div className="h-4 w-36 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <XCircle size={32} className="text-red-600" />
          </div>

          <h1 className="text-xl font-bold text-gray-900">Receipt Not Found</h1>

          <p className="text-sm text-gray-500 mt-2">
            {error || "We could not find this transaction."}
          </p>

          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-2xl bg-orange-500 text-white font-semibold"
          >
            <ArrowLeft size={17} />
            Back to Transactions
          </Link>
        </div>
      </div>
    );
  }

  const amountIsPositive = transaction.isCredit || isCashback;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-4">
          <Link
            href="/dashboard/transactions"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Transaction Receipt
            </h1>

            <p className="text-xs text-gray-500">Transaction details</p>
          </div>
        </div>
      </header>

      {/* RECEIPT */}
      <main className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
          {/* RECEIPT HEADER */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 py-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Transaction Receipt</p>

                <h2 className="text-2xl font-bold mt-1">
                  {getTransactionName(transaction)}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                {isCashback ? (
                  <ArrowDownLeft size={28} />
                ) : amountIsPositive ? (
                  <ArrowDownLeft size={28} />
                ) : (
                  <ArrowUpRight size={28} />
                )}
              </div>
            </div>
          </div>

          {/* AMOUNT */}
          <div className="px-6 pt-7 text-center">
            <p
              className={`text-4xl font-extrabold ${
                amountIsPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {amountIsPositive ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>

            <div
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full mt-4 text-xs font-bold ${status?.bg} ${status?.text}`}
            >
              {status?.icon}
              {status?.label}
            </div>
          </div>

          {/* RECEIPT DETAILS */}
          <div className="p-6 space-y-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Transaction Details
            </div>

            {/* Transaction Type */}
            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <Receipt size={16} />
                <span className="text-sm">Transaction Type</span>
              </div>

              <span className="text-sm font-semibold text-gray-900 capitalize text-right">
                {getTransactionName(transaction)}
              </span>
            </div>

            {/* Recipient Number */}
            {transaction.phone && (
              <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone size={16} />
                  <span className="text-sm">Recipient Number</span>
                </div>

                <span className="text-sm font-semibold text-gray-900">
                  {String(transaction.phone)}
                </span>
              </div>
            )}

            {/* Network */}
            {transaction.network !== null &&
              transaction.network !== undefined && (
                <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Smartphone size={16} />
                    <span className="text-sm">Network</span>
                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {String(transaction.network)}
                  </span>
                </div>
              )}

            {/* Balance Before */}
            {transaction.balance_before !== null &&
              transaction.balance_before !== undefined && (
                <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Wallet size={16} />
                    <span className="text-sm">Balance Before</span>
                  </div>

                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(transaction.balance_before)}
                  </span>
                </div>
              )}

            {/* Balance After */}
            {transaction.balance_after !== null &&
              transaction.balance_after !== undefined && (
                <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Wallet size={16} />
                    <span className="text-sm">Balance After</span>
                  </div>

                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(transaction.balance_after)}
                  </span>
                </div>
              )}

            {/* Reference */}
            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <Hash size={16} />
                <span className="text-sm">Reference Number</span>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(transaction.reference)}
                className="flex items-center gap-1.5 max-w-[220px] text-right"
              >
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {transaction.reference}
                </span>

                <Copy size={14} className="text-orange-600 shrink-0" />

                {copied === transaction.reference && (
                  <span className="text-xs text-green-600 font-medium shrink-0">
                    Copied
                  </span>
                )}
              </button>
            </div>

            {/* Provider Reference */}
            {transaction.provider_reference && (
              <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">
                  Provider Reference
                </span>

                <span className="text-sm font-semibold text-gray-900 text-right break-all max-w-[220px]">
                  {transaction.provider_reference}
                </span>
              </div>
            )}

            {/* API Reference */}
            {transaction.api_reference && (
              <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">API Reference</span>

                <span className="text-sm font-semibold text-gray-900 text-right break-all max-w-[220px]">
                  {transaction.api_reference}
                </span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Transaction Date</span>

              <span className="text-sm font-semibold text-gray-900 text-right">
                {formatDate(transaction.created_at)}
              </span>
            </div>

            {/* Description */}
            {transaction.description && (
              <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Description</span>

                <span className="text-sm font-semibold text-gray-900 text-right max-w-[220px]">
                  {transaction.description}
                </span>
              </div>
            )}

            {/* Message */}
            {transaction.message && (
              <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100">
                <span className="text-sm text-gray-500">Message</span>

                <span className="text-sm font-semibold text-gray-900 text-right max-w-[220px]">
                  {transaction.message}
                </span>
              </div>
            )}

            {/* Refund */}
            {transaction.refunded !== null &&
              transaction.refunded !== undefined && (
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-gray-500">Refunded</span>

                  <span
                    className={`text-sm font-semibold ${
                      transaction.refunded ? "text-purple-600" : "text-gray-700"
                    }`}
                  >
                    {transaction.refunded ? "Yes" : "No"}
                  </span>
                </div>
              )}
          </div>

          {/* FOOTER */}
          <div className="mx-6 mb-6 border-t border-dashed border-gray-200 pt-5">
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Receipt size={15} />

              <p className="text-xs text-center">
                This receipt is a record of your transaction.
              </p>
            </div>

            <p className="text-[11px] text-gray-400 text-center mt-2 break-all">
              Reference: {transaction.reference}
            </p>
          </div>
        </div>

        {/* BACK BUTTON */}
        <Link
          href="/dashboard/transactions"
          className="flex items-center justify-center gap-2 w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-semibold transition"
        >
          <ArrowLeft size={18} />
          Back to Transactions
        </Link>
      </main>
    </div>
  );
}
