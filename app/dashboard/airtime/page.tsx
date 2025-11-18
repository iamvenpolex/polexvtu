"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PhoneCall,
  Wallet,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// Type for API response from NelloBytes
interface AirtimeApiResponse {
  Status?: string;
  Message?: string;
  TransactionID?: string;
  [key: string]: unknown;
}

// Type for a transaction object from your backend
interface Transaction {
  id: number;
  user_id: number;
  reference: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  api_amount: number;
  network: string;
  phone: string;
  via: string;
  description: string;
  balance_before: number;
  balance_after: number;
  updated_at?: string;
  message_id?: string;
}

// Type for the full Airtime response
interface AirtimeResponse {
  success?: boolean;
  requestID?: string;
  transaction?: Transaction;
  apiResponse?: AirtimeApiResponse;
  balanceAfter?: number;
  error?: string;
}

export default function AirtimePage() {
  const [network, setNetwork] = useState("");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<AirtimeResponse | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // Show modal helper
  const showModal = (message: string) => {
    setModalData({ error: message });
    setModalOpen(true);
  };

  const buyAirtime = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!network || !amount || !phone) {
      showModal("All fields are required");
      return;
    }

    if (Number(amount) < 50) {
      showModal("Minimum airtime amount is 50 Naira");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Make sure JWT is stored here
      const res = await fetch(`${BASE_URL}/api/airtime/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ network, amount, phone }),
      });

      const data: AirtimeResponse = await res.json();

      if (data.error) {
        showModal(data.error);
      } else {
        setModalData(data);
        setModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      showModal("Something went wrong, try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <PhoneCall size={18} className="text-orange-600" />
            Airtime Purchase
          </h1>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-md mx-auto mt-6 p-1">
        <form
          onSubmit={buyAirtime}
          className="bg-white p-5 rounded-2xl shadow-md space-y-4 border"
        >
          {/* Network */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Network
            </label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Network</option>
              <option value="01">MTN</option>
              <option value="02">GLO</option>
              <option value="04">Airtel</option>
              <option value="03">9mobile</option>
            </select>
          </div>

          {/* Phone Number */}
          <div className="text-black">
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-3">
              <PhoneCall size={18} className="text-orange-500" />
              <input
                type="tel"
                placeholder="08012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="text-black">
            <label className="block text-sm font-medium mb-1">Amount</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-3">
              <Wallet size={18} className="text-orange-500" />
              <input
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Processing..." : "Buy Airtime"}
          </button>
        </form>
      </div>

      {/* Modal */}
      {modalOpen && modalData && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end justify-center z-[999]"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-t-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3">
              {modalData.error ? (
                <XCircle size={48} className="text-red-500" />
              ) : (
                <CheckCircle2 size={48} className="text-green-600" />
              )}
            </div>

            <h2 className="text-center text-xl font-semibold text-gray-800">
              {modalData.error ? "Error" : "Success"}
            </h2>

            <p className="text-center text-gray-600 mt-1">
              {modalData.apiResponse?.Message || modalData.error || ""}
            </p>

            <div className="mt-4 space-y-2 text-gray-700 text-sm">
              {modalData.requestID && (
                <p>
                  <span className="font-semibold">Request ID:</span>{" "}
                  {modalData.requestID}
                </p>
              )}
              {modalData.apiResponse?.TransactionID && (
                <p>
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  {modalData.apiResponse.TransactionID}
                </p>
              )}
              {modalData.apiResponse?.Status && (
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {modalData.apiResponse.Status}
                </p>
              )}
              {modalData.balanceAfter !== undefined && (
                <p>
                  <span className="font-semibold">Balance After:</span>{" "}
                  {modalData.balanceAfter}
                </p>
              )}
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full bg-orange-600 text-white py-3 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal Animation */}
      <style>{`
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
