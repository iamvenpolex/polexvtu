"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, MessageCircle, X } from "lucide-react";
import Link from "next/link";

// ---------- Types ----------
interface SMSResult {
  message: string;
  smsResult: string;
  totalCost: number;
  pricePerSMS: number;
  balanceAfter: number;
}

interface ParsedSMSResult {
  status: string;
  recipient: string;
  messageId: string;
  providerMessage: string;
  network: string;
  country: string;
}

const SMSPage = () => {
  const [price, setPrice] = useState(0);
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SMSResult | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchPrice = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sms/current-price`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPrice(res.data.price);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrice();
  }, [token]);

  const handleSendSMS = async () => {
    if (!recipients || !message || !sender || !token) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<SMSResult>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sms/send`,
        { recipients, message, sender },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to send SMS");
      } else {
        alert("Failed to send SMS");
      }
      console.error(err);
    }
    setLoading(false);
  };

  const totalRecipients = recipients
    ? recipients.split(",").filter((x) => x.trim() !== "").length
    : 0;

  const smsPages = Math.ceil(message.length / 160) || 1;
  const totalCost = totalRecipients * price * smsPages;

  // Parse SMS result for clean display
  const parseSMSResult = (smsResult: string): ParsedSMSResult => {
    const parts = smsResult.split("|");
    return {
      status: parts[3] || "Unknown",
      recipient: parts[1] || "-",
      messageId: parts[2] || "-",
      providerMessage: parts[4] || "-",
      network: parts[5] || "-",
      country: parts[6] || "-",
    };
  };

  return (
    <div className="max-w-xl mx-auto p-1">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm mb-6">
        <div className="flex items-center gap-3 px-2 py-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MessageCircle size={18} className="text-orange-600" />
            Send Bulk SMS
          </h1>
        </div>
      </header>

      {/* FORM */}
      <div className="bg-white p-5 rounded-xl shadow space-y-5 border border-orange-100">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Sender Name
          </label>
          <input
            type="text"
            value={sender}
            maxLength={11}
            onChange={(e) => setSender(e.target.value)}
            className="w-full p-3 text-black border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="e.g TapAm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Recipients (comma-separated)
          </label>
          <input
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="w-full p-3 border text-black border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="080..., 090..., 081..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Message ({message.length}/160 per page)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 text-black border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            rows={4}
            placeholder="Type your message..."
          />
        </div>

        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg text-sm text-orange-700 space-y-1">
          <p>
            Recipients: <b>{totalRecipients}</b>
          </p>
          <p>
            SMS Pages: <b>{smsPages}</b>
          </p>
          <p>
            Price per SMS: <b>₦{price}</b>
          </p>
          <p>
            Total Cost: <b>₦{totalCost}</b>
          </p>
        </div>

        <button
          onClick={handleSendSMS}
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold shadow-md transition"
        >
          {loading ? "Sending..." : "Send SMS"}
        </button>
      </div>

      {/* MODAL */}
      {result && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6 relative animate-fadeIn">
            <button
              onClick={() => setResult(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-orange-700 mb-4">
              SMS Delivery Report
            </h2>

            {result.smsResult && (
              <div className="space-y-1 text-sm text-orange-900">
                {(() => {
                  const parsed = parseSMSResult(result.smsResult);
                  const isSuccess = parsed.status.toLowerCase() === "sent";
                  return (
                    <>
                      <p>
                        <b>Status:</b>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                            isSuccess ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {parsed.status}
                        </span>
                      </p>
                      <p>
                        <b>Recipient:</b> {parsed.recipient}
                      </p>
                      <p>
                        <b>Message ID:</b> {parsed.messageId}
                      </p>
                      <p>
                        <b>Network:</b> {parsed.network}
                      </p>
                      <p>
                        <b>Country:</b> {parsed.country}
                      </p>
                      <p>
                        <b>Provider Message:</b>{" "}
                        <span
                          className={`px-2 py-1 rounded text-white text-xs font-medium ${
                            isSuccess ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {parsed.providerMessage}
                        </span>
                      </p>
                      <p>
                        <b>Cost:</b> ₦{result.totalCost}
                      </p>
                      <p>
                        <b>Price per SMS:</b> ₦{result.pricePerSMS}
                      </p>
                      <p>
                        <b>Balance After:</b> ₦{result.balanceAfter}
                      </p>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SMSPage;
