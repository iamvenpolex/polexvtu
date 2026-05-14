"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import {
  ArrowLeft,
  Ticket,
  Gift,
  CheckCircle2,
  XCircle,
  Clock3,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GiftCardHistory {
  id: number;
  gift_card_id: number | null;
  user_id: number;
  action: string;
  timestamp: string;
  balance_before: number | null;
  balance_after: number | null;
  reason: string;
  code: string | null;
  amount: number | null;
}

export default function GiftCardUserPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<GiftCardHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/giftcards/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setHistory(res.data);
    } catch (error) {
      console.error(error);
      showMessage("Failed to fetch redeem history");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const redeemCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      return showMessage("Please enter a coupon code");
    }

    try {
      setRedeeming(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/giftcards/redeem`,
        {
          code: code.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      showMessage(`🎉 Coupon redeemed successfully! ₦${res.data.amount}`);

      setCode("");
      fetchHistory();
    } catch (error: unknown) {
      let errMsg = "Failed to redeem coupon";

      if (axios.isAxiosError(error)) {
        errMsg = error.response?.data?.message || errMsg;
      }

      showMessage(errMsg);
    } finally {
      setRedeeming(false);
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const formatDate = (dateStr: string) => {
    if (typeof window === "undefined") return "";

    return new Date(dateStr).toLocaleString();
  };

  const copyCode = async (coupon: string) => {
    try {
      await navigator.clipboard.writeText(coupon);
      showMessage("Coupon code copied");
    } catch {
      showMessage("Failed to copy code");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4 max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Ticket size={20} className="text-orange-600" />
              Coupon Center
            </h1>
            <p className="text-sm text-gray-500">
              Redeem gift cards and track your history
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Redeem Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden"
        >
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Gift size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Redeem Coupon</h2>
                <p className="text-orange-100 text-sm">
                  Enter your coupon or gift card code below
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={redeemCard} className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 h-14 px-4 rounded-2xl border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg tracking-wide"
              />

              <button
                type="submit"
                disabled={redeeming}
                className={`h-14 px-8 rounded-2xl font-semibold text-white transition-all ${
                  redeeming
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 active:scale-95"
                }`}
              >
                {redeeming ? "Redeeming..." : "Redeem"}
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Clock3 size={15} />
              Coupon redemption is processed instantly
            </div>
          </form>
        </motion.div>

        {/* History Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Redeem History
              </h2>
              <p className="text-sm text-gray-500">
                View all your coupon activities
              </p>
            </div>

            <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-semibold">
              {history.length} Records
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="text-orange-500" size={32} />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                No History Yet
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Your redeemed coupons will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((h, index) => {
                const success = h.action === "success";

                return (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Top Summary */}
                    <div
                      onClick={() =>
                        setExpandedId(expandedId === h.id ? null : h.id)
                      }
                      className="p-5 cursor-pointer hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              success
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {success ? (
                              <CheckCircle2 size={24} />
                            ) : (
                              <XCircle size={24} />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-gray-800">
                                {h.code || "No Code"}
                              </h3>

                              {h.code && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyCode(h.code || "");
                                  }}
                                  className="text-gray-400 hover:text-orange-500 transition"
                                >
                                  <Copy size={15} />
                                </button>
                              )}
                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(h.timestamp)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              success
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {success ? "Redeemed" : "Failed"}
                          </span>

                          <p className="mt-2 text-lg font-bold text-orange-600">
                            ₦{h.amount?.toLocaleString() || "0"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedId === h.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-5 bg-gray-50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div className="bg-white rounded-xl p-4 border border-gray-100">
                                <p className="text-gray-500 mb-1">Reason</p>
                                <p className="font-semibold text-gray-800">
                                  {h.reason}
                                </p>
                              </div>

                              <div className="bg-white rounded-xl p-4 border border-gray-100">
                                <p className="text-gray-500 mb-1">
                                  Balance Before
                                </p>
                                <p className="font-semibold text-gray-800">
                                  ₦{h.balance_before?.toLocaleString() || "0"}
                                </p>
                              </div>

                              <div className="bg-white rounded-xl p-4 border border-gray-100">
                                <p className="text-gray-500 mb-1">
                                  Balance After
                                </p>
                                <p className="font-semibold text-gray-800">
                                  ₦{h.balance_after?.toLocaleString() || "0"}
                                </p>
                              </div>

                              <div className="bg-white rounded-xl p-4 border border-gray-100">
                                <p className="text-gray-500 mb-1">
                                  Transaction ID
                                </p>
                                <p className="font-semibold text-gray-800">
                                  #{h.id}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Toast Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium">
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
