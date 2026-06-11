"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type ReceiptStatus = "success" | "failed" | "pending";

type Receipt = {
  status: ReceiptStatus;
  phone: string;
  network: string;
  amount: number;
  cashback: number;
  reference: string;
  timestamp: string;
  message: string;
};

type MessageType = { type: "success" | "error"; text: string } | null;

const NETWORKS = [
  { id: "1", key: "mtn", name: "MTN", logo: "/mtn-mobile-logo-icon.png" },
  { id: "3", key: "glo", name: "GLO", logo: "/glo-logo.png" },
  { id: "2", key: "airtel", name: "Airtel", logo: "/Airtel_logo-01.png" },
  { id: "4", key: "9mobile", name: "9mobile", logo: "/9mobile-logo.png" },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimePage() {
  const [network, setNetwork] = useState("1");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageType>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [balance, setBalance] = useState(0);
  const [beneficiaries, setBeneficiaries] = useState<string[]>([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const selectedNetwork = NETWORKS.find((n) => n.id === network);
  const numericAmount = Number(amount) || 0;
  const cashbackPreview = Math.floor(numericAmount * 0.01);

  // ---------- AUTO REMOVE MESSAGE ----------
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  // ---------- FETCH BALANCE ----------
  useEffect(() => {
    if (!token) return;
    const run = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/wallet/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBalance(data.balance || 0);
      } catch {
        /* silent */
      }
    };
    run();
  }, [token]);

  // ---------- FETCH BENEFICIARIES ----------
  useEffect(() => {
    if (!token) return;
    setLoadingBeneficiaries(true);
    const run = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/airtime/beneficiaries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBeneficiaries(data.phones || []);
      } catch {
        setBeneficiaries([]);
      } finally {
        setLoadingBeneficiaries(false);
      }
    };
    run();
  }, [token]);

  // ---------- VALIDATE & OPEN REVIEW ----------
  const handleReview = () => {
    if (!/^\d{11}$/.test(phone)) {
      setMessage({
        type: "error",
        text: "Enter a valid 11-digit phone number",
      });
      return;
    }
    if (numericAmount < 50) {
      setMessage({ type: "error", text: "Minimum airtime amount is ₦50" });
      return;
    }
    if (numericAmount > 50000) {
      setMessage({ type: "error", text: "Maximum airtime amount is ₦50,000" });
      return;
    }
    if (balance < numericAmount) {
      setMessage({ type: "error", text: "Insufficient wallet balance" });
      return;
    }
    setShowReview(true);
  };

  // ---------- BUY AIRTIME ----------
  const confirmBuy = async () => {
    if (!token) {
      setMessage({ type: "error", text: "Please login again" });
      return;
    }

    setLoading(true);
    const reference = "AIRTIME_" + Date.now();

    try {
      const res = await fetch(`${BASE_URL}/api/airtime/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ network, amount: numericAmount, phone }),
      });

      const data = await res.json();
      const txStatus: ReceiptStatus =
        data.status || (data.success ? "success" : "failed");

      setReceipt({
        status: txStatus,
        phone,
        network: selectedNetwork?.name || network,
        amount: numericAmount,
        cashback: data.cashback || 0,
        reference: data.reference || reference,
        timestamp: new Date().toLocaleString("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        message:
          data.message ||
          (txStatus === "success"
            ? "Airtime purchase successful"
            : "Transaction failed"),
      });

      setShowReview(false);

      if (txStatus === "success") {
        // Refresh balance
        try {
          const wRes = await fetch(`${BASE_URL}/api/wallet/balance`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const wData = await wRes.json();
          setBalance(wData.balance || 0);
        } catch {
          /* non-critical */
        }

        // Refresh beneficiaries
        try {
          const bRes = await fetch(`${BASE_URL}/api/airtime/beneficiaries`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const bData = await bRes.json();
          setBeneficiaries(bData.phones || []);
        } catch {
          /* non-critical */
        }

        setPhone("");
        setAmount("");
      }
    } catch {
      setReceipt({
        status: "failed",
        phone,
        network: selectedNetwork?.name || network,
        amount: numericAmount,
        cashback: 0,
        reference,
        timestamp: new Date().toLocaleString("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        message: "Network error. Please try again.",
      });
      setShowReview(false);
    } finally {
      setLoading(false);
    }
  };

  // ══════════════════════════════════════════
  // RECEIPT PAGE
  // ══════════════════════════════════════════
  if (receipt) {
    const isSuccess = receipt.status === "success";
    const isPending = receipt.status === "pending";
    const bandColor = isSuccess
      ? "bg-orange-500"
      : isPending
        ? "bg-yellow-500"
        : "bg-red-500";

    return (
      <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
        <div
          className={`flex flex-col items-center justify-center pt-16 pb-12 px-6 ${bandColor}`}
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
            {isSuccess ? (
              <CheckCircle2 size={44} className="text-white" />
            ) : isPending ? (
              <Clock size={44} className="text-white" />
            ) : (
              <XCircle size={44} className="text-white" />
            )}
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">
            {isSuccess
              ? "Purchase Successful"
              : isPending
                ? "Processing"
                : "Transaction Failed"}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-white">
            ₦{receipt.amount.toLocaleString()}
          </h1>
          {isSuccess && receipt.cashback > 0 && (
            <div className="mt-2 rounded-full bg-white/20 px-4 py-1.5">
              <p className="text-sm font-bold text-white">
                +₦{receipt.cashback} cashback credited 🎉
              </p>
            </div>
          )}
          <p className="mt-2 max-w-xs text-center text-sm text-white/80 leading-relaxed">
            {receipt.message}
          </p>
        </div>

        {/* Receipt card */}
        <div className="mx-4 -mt-5 rounded-3xl bg-white shadow-xl overflow-hidden">
          <div className="flex h-4 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${bandColor}`}
                style={{
                  clipPath:
                    i % 2 === 0
                      ? "polygon(0 0, 100% 0, 50% 100%)"
                      : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                }}
              />
            ))}
          </div>

          <div className="px-5 py-5 space-y-0">
            {[
              { label: "Network", value: receipt.network },
              { label: "Phone Number", value: receipt.phone },
              {
                label: "Airtime Amount",
                value: `₦${receipt.amount.toLocaleString()}`,
                bold: true,
              },
              ...(receipt.cashback > 0
                ? [
                    {
                      label: "1% Cashback",
                      value: `+₦${receipt.cashback}`,
                      green: true,
                    },
                  ]
                : []),
              { label: "Reference", value: receipt.reference, mono: true },
              { label: "Date & Time", value: receipt.timestamp },
              {
                label: "Status",
                value: isSuccess
                  ? "Successful"
                  : isPending
                    ? "Processing"
                    : "Failed",
                colored: receipt.status,
              },
            ].map((row, i, arr) => (
              <div key={i}>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span
                    className={`max-w-[58%] text-right text-sm leading-snug ${
                      (row as any).mono
                        ? "font-mono text-xs text-gray-500"
                        : (row as any).bold
                          ? "font-extrabold text-gray-900"
                          : (row as any).green
                            ? "font-bold text-green-600"
                            : (row as any).colored
                              ? (row as any).colored === "success"
                                ? "font-bold text-green-600"
                                : (row as any).colored === "pending"
                                  ? "font-bold text-yellow-600"
                                  : "font-bold text-red-500"
                              : "font-semibold text-gray-800"
                    }`}
                  >
                    {row.value}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="border-b border-dashed border-gray-100" />
                )}
              </div>
            ))}
          </div>

          <div className="flex h-4 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-[#f0f4f8]"
                style={{
                  clipPath:
                    i % 2 === 0
                      ? "polygon(0 100%, 100% 100%, 50% 0)"
                      : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="px-4 mt-6 pb-10 space-y-3">
          <button
            onClick={() => {
              setReceipt(null);
            }}
            className={`w-full rounded-2xl py-4 font-bold text-white shadow-md ${bandColor}`}
          >
            Buy Again
          </button>
          <Link
            href="/dashboard"
            className="block w-full rounded-2xl bg-white py-4 text-center font-semibold text-gray-700 shadow-sm border border-gray-100"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // MAIN PAGE
  // ══════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* TOAST */}
      {message && (
        <div
          className={`fixed top-5 left-1/2 z-[200] -translate-x-1/2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl backdrop-blur-md ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Buy Airtime</h1>
              <p className="text-xs text-gray-500">
                1% cashback on every purchase
              </p>
            </div>
          </div>
          <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
            ₦{balance.toLocaleString()}
          </div>
        </div>
      </header>

      {/* NETWORK SELECTOR */}
      <div className="px-4 pt-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {NETWORKS.map((item) => (
            <button
              key={item.id}
              onClick={() => setNetwork(item.id)}
              className={`min-w-[80px] rounded-2xl border-2 p-3 transition-all ${
                network === item.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-gray-100">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <span
                  className={`text-[11px] font-bold ${network === item.id ? "text-orange-600" : "text-gray-600"}`}
                >
                  {item.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PHONE INPUT */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-2 text-orange-500">
              <Phone size={16} />
            </div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={11}
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-transparent text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
            />
            {phone.length > 0 && (
              <span
                className={`text-xs font-semibold ${phone.length === 11 ? "text-green-500" : "text-gray-400"}`}
              >
                {phone.length}/11
              </span>
            )}
          </div>
        </div>
      </div>

      {/* BENEFICIARIES */}
      {(loadingBeneficiaries || beneficiaries.length > 0) && (
        <div className="px-4 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Previous Numbers
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {loadingBeneficiaries
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-28 animate-pulse rounded-full bg-gray-200"
                  />
                ))
              : beneficiaries.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setPhone(item)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition-all ${
                      phone === item
                        ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {item}
                  </button>
                ))}
          </div>
        </div>
      )}

      {/* AMOUNT — quick chips + custom input */}
      <div className="px-4 pt-4">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Select Amount
        </p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              onClick={() => setAmount(String(q))}
              className={`rounded-2xl border py-3 text-sm font-bold transition-all ${
                amount === String(q)
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              ₦{q.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Custom amount input */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-gray-400">₦</span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-transparent text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="mt-1.5 flex justify-between text-xs text-gray-400 px-1">
          <span>Min: ₦50</span>
          <span>Max: ₦50,000</span>
        </div>
      </div>

      {/* SUMMARY CARD */}
      {numericAmount >= 50 && phone.length === 11 && (
        <div className="mx-4 mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Network</span>
            <span className="font-semibold text-gray-800">
              {selectedNetwork?.name}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Phone</span>
            <span className="font-semibold text-gray-800">{phone}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Amount</span>
            <span className="font-bold text-gray-900">
              ₦{numericAmount.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-orange-200 pt-2 flex justify-between text-sm">
            <span className="text-green-600 font-semibold">1% Cashback</span>
            <span className="font-bold text-green-600">
              +₦{cashbackPreview}
            </span>
          </div>
        </div>
      )}

      {/* BUY BUTTON */}
      <div className="px-4 mt-4">
        <button
          onClick={handleReview}
          disabled={loading}
          className="w-full rounded-2xl bg-orange-500 py-4 font-bold text-white shadow-md transition-all hover:bg-orange-600 disabled:opacity-70 active:scale-95"
        >
          Buy Airtime
        </button>
      </div>

      {/* REVIEW MODAL */}
      {showReview && (
        <div className="fixed inset-0 z-[150] flex items-end bg-black/50 backdrop-blur-sm">
          <div className="w-full rounded-t-[28px] bg-white p-5 animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-gray-200" />

            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2.5 text-orange-500">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Confirm Purchase
                </h2>
                <p className="text-xs text-gray-400">Review before paying</p>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 px-4 overflow-hidden">
              {[
                { label: "Network", value: selectedNetwork?.name },
                { label: "Phone", value: phone },
                {
                  label: "Amount",
                  value: `₦${numericAmount.toLocaleString()}`,
                },
                {
                  label: "1% Cashback",
                  value: `+₦${cashbackPreview}`,
                  green: true,
                },
              ].map((row, i, arr) => (
                <div key={i}>
                  <div className="flex justify-between py-3">
                    <span className="text-sm text-gray-500">{row.label}</span>
                    <span
                      className={`text-sm font-semibold ${(row as any).green ? "text-green-600" : "text-gray-800"}`}
                    >
                      {row.value}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="border-b border-dashed border-gray-200" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={confirmBuy}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3.5 font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Confirm & Pay"
              )}
            </button>

            <button
              onClick={() => setShowReview(false)}
              className="mt-2.5 w-full rounded-2xl bg-gray-100 py-3 text-sm font-semibold text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
