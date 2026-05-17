"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  PhoneCall,
  Wallet,
  CheckCircle2,
  XCircle,
  Loader2,
  Smartphone,
  Clock3,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface AirtimeApiResponse {
  status?: string;
  message?: string;
  response?: string;
  network?: string;
  amount?: string;
  airtime_type?: string;
  old_wallet?: number;
  new_wallet?: number;
  ["request-id"]?: string;
  [key: string]: unknown;
}

interface AirtimeResponse {
  success?: boolean;
  message?: string;
  reference?: string;
  transaction_status?: string;
  api_response?: AirtimeApiResponse;
  error?: string;
}

const NETWORKS = [
  {
    id: "1",
    name: "MTN",
    logo: "/mtn-mobile-logo-icon.png",
    color: "bg-yellow-100 border-yellow-300",
  },
  {
    id: "3",
    name: "GLO",
    logo: "/glo-logo.png",
    color: "bg-green-100 border-green-300",
  },
  {
    id: "2",
    name: "Airtel",
    logo: "/Airtel_logo-01.png",
    color: "bg-red-100 border-red-300",
  },
  {
    id: "4",
    name: "9mobile",
    logo: "/9mobile-logo.png",
    color: "bg-emerald-100 border-emerald-300",
  },
];

export default function AirtimePage() {
  const [network, setNetwork] = useState("1");

  const [amount, setAmount] = useState("");

  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [modalData, setModalData] = useState<AirtimeResponse | null>(null);

  const showModal = (data: AirtimeResponse) => {
    setModalData(data);
    setModalOpen(true);
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);

    setPhone(cleaned);
  };

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");

    setAmount(cleaned);
  };

  const selectedNetwork = NETWORKS.find((n) => n.id === network);

  const buyAirtime = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!network || !amount || !phone) {
      return showModal({
        error: "Please fill in all required fields",
      });
    }

    if (!/^0\d{10}$/.test(phone)) {
      return showModal({
        error: "Please enter a valid 11-digit phone number",
      });
    }

    if (Number(amount) < 50) {
      return showModal({
        error: "Minimum airtime amount is ₦50",
      });
    }

    if (Number(amount) > 50000) {
      return showModal({
        error: "Maximum airtime amount is ₦50,000",
      });
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return showModal({
          error: "Please login to continue",
        });
      }

      const res = await fetch(`${BASE_URL}/api/airtime/buy`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          network,
          amount,
          phone,
        }),
      });

      const data: AirtimeResponse = await res.json();

      if (!res.ok) {
        return showModal({
          error:
            data.error ||
            data.message ||
            data.api_response?.message ||
            "Airtime purchase failed",
        });
      }

      showModal(data);

      setAmount("");
      setPhone("");
    } catch {
      showModal({
        error: "Network error — please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const isPending = modalData?.transaction_status === "pending";

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition hover:bg-orange-200"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <PhoneCall size={18} className="text-orange-500" />
              Buy Airtime
            </h1>

            <p className="text-xs text-gray-500">
              Fast and secure airtime recharge
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-3xl p-4">
        {/* HERO */}
        <div className="mb-5 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-100">
                Recharge your line instantly
              </p>

              <h2 className="mt-1 text-2xl font-bold">Airtime Purchase</h2>
            </div>

            <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
              <Smartphone size={34} />
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={buyAirtime}
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          {/* NETWORK */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-800">
                Select Network
              </label>

              {selectedNetwork && (
                <span className="text-xs font-medium text-orange-600">
                  {selectedNetwork.name} Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {NETWORKS.map((item) => {
                const active = network === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setNetwork(item.id)}
                    className={`relative overflow-hidden rounded-2xl border-2 p-3 transition-all duration-200 ${
                      active
                        ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
                        : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/40"
                    }`}
                  >
                    {active && (
                      <div className="absolute right-2 top-2">
                        <div className="rounded-full bg-orange-500 p-1 text-white">
                          <CheckCircle2 size={12} />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col items-center justify-center gap-2">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full border bg-white ${item.color}`}
                      >
                        <Image
                          src={item.logo}
                          alt={item.name}
                          width={34}
                          height={34}
                          className="object-contain"
                        />
                      </div>

                      <span
                        className={`text-sm font-semibold ${
                          active ? "text-orange-700" : "text-gray-700"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PHONE */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Phone Number
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
              <PhoneCall size={20} className="text-orange-500" />

              <input
                type="tel"
                inputMode="numeric"
                maxLength={11}
                placeholder="08012345678"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full bg-transparent text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Enter a valid 11-digit phone number
              </p>

              <p
                className={`text-xs font-medium ${
                  phone.length === 11 ? "text-green-600" : "text-gray-400"
                }`}
              >
                {phone.length}/11
              </p>
            </div>
          </div>

          {/* AMOUNT */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Airtime Amount
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100">
              <Wallet size={20} className="text-orange-500" />

              <input
                type="tel"
                inputMode="numeric"
                placeholder="100"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full bg-transparent text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Minimum: ₦50</span>

              <span>Maximum: ₦50,000</span>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Network</span>

              <span className="font-semibold text-gray-900">
                {selectedNetwork?.name}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Phone Number</span>

              <span className="font-semibold text-gray-900">
                {phone || "--------"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">Amount</span>

              <span className="text-lg font-bold text-orange-600">
                ₦{amount || "0"}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing Purchase...
              </>
            ) : (
              <>
                <Wallet size={18} />
                Buy Airtime
              </>
            )}
          </button>
        </form>
      </div>

      {/* MODAL */}
      {modalOpen && modalData && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-slideUp w-full max-w-md rounded-t-[30px] bg-white p-6"
          >
            <div className="flex justify-center">
              {modalData.error ? (
                <div className="rounded-full bg-red-100 p-4">
                  <XCircle size={42} className="text-red-500" />
                </div>
              ) : isPending ? (
                <div className="rounded-full bg-yellow-100 p-4">
                  <Clock3 size={42} className="text-yellow-600" />
                </div>
              ) : (
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle2 size={42} className="text-green-600" />
                </div>
              )}
            </div>

            <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
              {modalData.error
                ? "Transaction Failed"
                : isPending
                  ? "Transaction Pending"
                  : "Purchase Successful"}
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-gray-500">
              {modalData.error ||
                modalData.message ||
                modalData.api_response?.message ||
                "Your airtime purchase was processed successfully"}
            </p>

            {!modalData.error && (
              <div className="mt-6 space-y-3 rounded-2xl bg-gray-50 p-4">
                {modalData.reference && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Reference</span>

                    <span className="text-sm font-semibold text-gray-900">
                      {modalData.reference}
                    </span>
                  </div>
                )}

                {modalData.transaction_status && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        modalData.transaction_status === "success"
                          ? "bg-green-100 text-green-700"
                          : modalData.transaction_status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {modalData.transaction_status}
                    </span>
                  </div>
                )}

                {modalData.api_response?.["request-id"] && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Provider ID</span>

                    <span className="text-sm font-semibold text-gray-900">
                      {modalData.api_response?.["request-id"]}
                    </span>
                  </div>
                )}

                {modalData.api_response?.network && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Network</span>

                    <span className="text-sm font-semibold text-gray-900">
                      {modalData.api_response?.network}
                    </span>
                  </div>
                )}

                {modalData.api_response?.amount && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Amount</span>

                    <span className="text-sm font-semibold text-gray-900">
                      ₦{Number(modalData.api_response?.amount).toLocaleString()}
                    </span>
                  </div>
                )}

                {modalData.api_response?.new_wallet !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Wallet Balance
                    </span>

                    <span className="text-base font-bold text-orange-600">
                      ₦
                      {Number(
                        modalData.api_response?.new_wallet,
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

                {modalData.api_response?.response && (
                  <div className="rounded-xl bg-white p-3 text-sm text-gray-700">
                    {modalData.api_response?.response}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full rounded-2xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style jsx>{`
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

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
