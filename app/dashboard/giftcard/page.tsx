"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";

interface GiftCardHistory {
  id: number;
  gift_card_id: number | null;
  user_id: number;
  action: string; // "success" or "failed"
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
  const [redeeming, setRedeeming] = useState(false); // loading for button
  const [token, setToken] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Safely get token on client
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(res.data);
    } catch (error) {
      console.error("Error fetching gift card history:", error);
      showMessage("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const redeemCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return showMessage("Please enter a gift card code");

    try {
      setRedeeming(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/giftcards/redeem`,
        { code: code.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage(`Redeemed successfully! Amount: ₦${res.data.amount}`);
      setCode("");
      fetchHistory();
    } catch (error: unknown) {
      let errMsg = "Failed to redeem";
      if (axios.isAxiosError(error)) {
        errMsg = error.response?.data?.message || errMsg;
      }
      console.error("Redeem error:", error);
      showMessage(errMsg);
    } finally {
      setRedeeming(false);
    }
  };

  // Display message in a modal
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const formatDate = (dateStr: string) => {
    if (typeof window === "undefined") return "";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm mb-4">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Ticket size={18} className="text-orange-600" />
            Gift Cards
          </h1>
        </div>
      </header>

      {/* Redeem Form */}
      <form onSubmit={redeemCard} className="mb-6 relative">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter gift card code"
          className="w-full border rounded px-3 text-black py-2 mb-2"
        />
        <button
          type="submit"
          disabled={redeeming}
          className={`w-full px-4 py-2 rounded text-white ${
            redeeming
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {redeeming ? "Redeeming..." : "Redeem"}
        </button>
      </form>

      {/* Message Modal */}
      {message && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded shadow-lg animate-fade-in-out z-50">
          {message}
        </div>
      )}

      {/* History */}
      <h2 className="text-xl font-semibold mb-2 text-orange-500">
        Your Redeem History
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No history found</p>
      ) : (
        <div className="space-y-2">
          {history.map((h) => (
            <div
              key={h.id}
              className="border rounded p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(expandedId === h.id ? null : h.id)}
            >
              <div className="flex justify-between">
                <span className="font-semibold text-black">
                  {h.code || "-"}
                </span>
                <span
                  className={`font-semibold ${
                    h.action === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {h.action === "success" ? "Redeemed" : "Failed"}
                </span>
              </div>
              {expandedId === h.id && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-orange-500">
                      Amount:
                    </span>{" "}
                    ₦{h.amount ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-orange-500">
                      Reason:
                    </span>{" "}
                    {h.reason}
                  </p>
                  <p>
                    <span className="font-semibold text-orange-500">
                      Balance Before:
                    </span>{" "}
                    ₦{h.balance_before ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-orange-500">
                      Balance After:
                    </span>{" "}
                    ₦{h.balance_after ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-orange-500">
                      Timestamp:
                    </span>{" "}
                    {formatDate(h.timestamp)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tailwind animation for modal */}
      <style>
        {`
          @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(20px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-out {
            animation: fadeInOut 3s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
}
