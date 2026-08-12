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

type MessageType = {
  type: "success" | "error";
  text: string;
} | null;

type Network = {
  id: string;
  key: string;
  name: string;
  logo: string;
};

type ApiResponse = {
  success?: boolean;
  status?: string;
  message?: string;
  reference?: string;
  cashback?: number;
  transaction_status?: string;
};

type WalletResponse = {
  balance?: number | string;
};

type BeneficiariesResponse = {
  success?: boolean;
  phones?: string[];
};

type ReceiptRow = {
  label: string;
  value: string;
  bold?: boolean;
  green?: boolean;
  mono?: boolean;
  colored?: ReceiptStatus;
};

const NETWORKS: Network[] = [
  {
    id: "1",
    key: "mtn",
    name: "MTN",
    logo: "/mtn-mobile-logo-icon.png",
  },
  {
    id: "2",
    key: "airtel",
    name: "Airtel",
    logo: "/Airtel_logo-01.png",
  },
  {
    id: "3",
    key: "glo",
    name: "GLO",
    logo: "/glo-logo.png",
  },
  {
    id: "4",
    key: "9mobile",
    name: "9mobile",
    logo: "/9mobile-logo.png",
  },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const MIN_AMOUNT = 50;
const MAX_AMOUNT = 50000;
const CASHBACK_RATE = 0.01;

export default function AirtimePage() {
  const [network, setNetwork] = useState<string>("1");
  const [amount, setAmount] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageType>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [showReview, setShowReview] = useState<boolean>(false);

  const [balance, setBalance] = useState<number>(0);
  const [beneficiaries, setBeneficiaries] = useState<string[]>([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] =
    useState<boolean>(false);

  const [token, setToken] = useState<string | null>(null);

  const selectedNetwork = NETWORKS.find((item) => item.id === network);

  const numericAmount = Number(amount) || 0;

  const cashbackPreview = Math.floor(numericAmount * CASHBACK_RATE);

  // ==========================================
  // GET TOKEN
  // ==========================================

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // ==========================================
  // AUTO REMOVE MESSAGE
  // ==========================================

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [message]);

  // ==========================================
  // FETCH BALANCE
  // ==========================================

  const fetchBalance = async (): Promise<void> => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/wallet/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      const data: WalletResponse = await response.json();

      setBalance(Number(data.balance) || 0);
    } catch {
      // Balance failure is non-critical
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    void fetchBalance();
  }, [token]);

  // ==========================================
  // FETCH BENEFICIARIES
  // ==========================================

  const fetchBeneficiaries = async (): Promise<void> => {
    if (!token) {
      return;
    }

    setLoadingBeneficiaries(true);

    try {
      const response = await fetch(`${BASE_URL}/api/airtime/beneficiaries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setBeneficiaries([]);
        return;
      }

      const data: BeneficiariesResponse = await response.json();

      setBeneficiaries(Array.isArray(data.phones) ? data.phones : []);
    } catch {
      setBeneficiaries([]);
    } finally {
      setLoadingBeneficiaries(false);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    void fetchBeneficiaries();
  }, [token]);

  // ==========================================
  // VALIDATE PHONE
  // ==========================================

  const validatePhone = (): boolean => {
    if (!/^\d{11}$/.test(phone)) {
      setMessage({
        type: "error",
        text: "Enter a valid 11-digit phone number",
      });

      return false;
    }

    return true;
  };

  // ==========================================
  // VALIDATE AMOUNT
  // ==========================================

  const validateAmount = (): boolean => {
    if (numericAmount < MIN_AMOUNT) {
      setMessage({
        type: "error",
        text: "Minimum airtime amount is ₦50",
      });

      return false;
    }

    if (numericAmount > MAX_AMOUNT) {
      setMessage({
        type: "error",
        text: "Maximum airtime amount is ₦50,000",
      });

      return false;
    }

    return true;
  };

  // ==========================================
  // OPEN REVIEW
  // ==========================================

  const handleReview = (): void => {
    if (!selectedNetwork) {
      setMessage({
        type: "error",
        text: "Please select a network",
      });

      return;
    }

    if (!validatePhone()) {
      return;
    }

    if (!validateAmount()) {
      return;
    }

    if (balance < numericAmount) {
      setMessage({
        type: "error",
        text: "Insufficient wallet balance",
      });

      return;
    }

    setShowReview(true);
  };

  // ==========================================
  // BUY AIRTIME
  // ==========================================

  const confirmBuy = async (): Promise<void> => {
    if (!token) {
      setMessage({
        type: "error",
        text: "Please login again",
      });

      return;
    }

    if (!selectedNetwork) {
      setMessage({
        type: "error",
        text: "Please select a network",
      });

      return;
    }

    setLoading(true);

    const reference = `AIRTIME_${Date.now()}`;

    try {
      const response = await fetch(`${BASE_URL}/api/airtime/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          network: selectedNetwork.id,
          amount: numericAmount,
          phone,
        }),
      });

      let data: ApiResponse = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      let txStatus: ReceiptStatus = "failed";

      if (data.status === "success" || data.transaction_status === "success") {
        txStatus = "success";
      } else if (
        data.status === "pending" ||
        data.transaction_status === "pending"
      ) {
        txStatus = "pending";
      } else {
        txStatus = "failed";
      }

      const cashback = Number(data.cashback) || 0;

      setReceipt({
        status: txStatus,
        phone,
        network: selectedNetwork.name,
        amount: numericAmount,
        cashback,
        reference: data.reference || reference,
        timestamp: new Date().toLocaleString("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        message:
          data.message ||
          (txStatus === "success"
            ? "Airtime purchase successful"
            : txStatus === "pending"
              ? "Airtime purchase is being processed"
              : "Airtime purchase failed"),
      });

      setShowReview(false);

      // ========================================
      // SUCCESS
      // ========================================

      if (txStatus === "success") {
        await fetchBalance();
        await fetchBeneficiaries();

        setPhone("");
        setAmount("");

        return;
      }

      // ========================================
      // PENDING
      // ========================================

      if (txStatus === "pending") {
        await fetchBalance();
        return;
      }

      // ========================================
      // FAILED
      // ========================================

      await fetchBalance();
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
        message: "Unable to connect to the server. Please try again.",
      });

      setShowReview(false);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RECEIPT PAGE
  // ==========================================

  if (receipt) {
    const isSuccess = receipt.status === "success";
    const isPending = receipt.status === "pending";

    const bandColor = isSuccess
      ? "bg-orange-500"
      : isPending
        ? "bg-yellow-500"
        : "bg-red-500";

    const statusText = isSuccess
      ? "Successful"
      : isPending
        ? "Processing"
        : "Failed";

    const receiptRows: ReceiptRow[] = [
      {
        label: "Network",
        value: receipt.network,
      },
      {
        label: "Phone Number",
        value: receipt.phone,
      },
      {
        label: "Airtime Amount",
        value: `₦${receipt.amount.toLocaleString()}`,
        bold: true,
      },
    ];

    if (receipt.cashback > 0) {
      receiptRows.push({
        label: "1% Cashback",
        value: `+₦${receipt.cashback.toLocaleString()}`,
        green: true,
      });
    }

    receiptRows.push(
      {
        label: "Reference",
        value: receipt.reference,
        mono: true,
      },
      {
        label: "Date & Time",
        value: receipt.timestamp,
      },
      {
        label: "Status",
        value: statusText,
        colored: receipt.status,
      },
    );

    return (
      <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
        {/* HEADER STATUS */}
        <div
          className={`flex flex-col items-center justify-center px-6 pt-16 pb-12 ${bandColor}`}
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
                +₦{receipt.cashback.toLocaleString()} cashback credited
              </p>
            </div>
          )}

          <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-white/80">
            {receipt.message}
          </p>
        </div>

        {/* RECEIPT CARD */}
        <div className="mx-4 -mt-5 overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="flex h-4 overflow-hidden">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 ${bandColor}`}
                style={{
                  clipPath:
                    index % 2 === 0
                      ? "polygon(0 0, 100% 0, 50% 100%)"
                      : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                }}
              />
            ))}
          </div>

          <div className="space-y-0 px-5 py-5">
            {receiptRows.map((row, index) => {
              let valueClass = "font-semibold text-gray-800";

              if (row.mono) {
                valueClass = "font-mono text-xs text-gray-500";
              } else if (row.bold) {
                valueClass = "font-extrabold text-gray-900";
              } else if (row.green) {
                valueClass = "font-bold text-green-600";
              } else if (row.colored === "success") {
                valueClass = "font-bold text-green-600";
              } else if (row.colored === "pending") {
                valueClass = "font-bold text-yellow-600";
              } else if (row.colored === "failed") {
                valueClass = "font-bold text-red-500";
              }

              return (
                <div key={`${row.label}-${index}`}>
                  <div className="flex items-center justify-between py-3.5">
                    <span className="text-sm text-gray-400">{row.label}</span>

                    <span
                      className={`max-w-[58%] text-right text-sm leading-snug ${valueClass}`}
                    >
                      {row.value}
                    </span>
                  </div>

                  {index < receiptRows.length - 1 && (
                    <div className="border-b border-dashed border-gray-100" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex h-4 overflow-hidden">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="flex-1 bg-[#f0f4f8]"
                style={{
                  clipPath:
                    index % 2 === 0
                      ? "polygon(0 100%, 100% 100%, 50% 0)"
                      : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                }}
              />
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 space-y-3 px-4 pb-10">
          <button
            type="button"
            onClick={() => {
              setReceipt(null);
            }}
            className={`w-full rounded-2xl py-4 font-bold text-white shadow-md ${bandColor}`}
          >
            Buy Again
          </button>

          <Link
            href="/dashboard"
            className="block w-full rounded-2xl border border-gray-100 bg-white py-4 text-center font-semibold text-gray-700 shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* TOAST */}
      {message && (
        <div
          className={`fixed left-1/2 top-5 z-[200] -translate-x-1/2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl backdrop-blur-md ${
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
                Get 1% cashback on every purchase
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
        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
          {NETWORKS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setNetwork(item.id)}
              className={`min-w-[80px] rounded-2xl border-2 p-3 transition-all ${
                network === item.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>

                <span
                  className={`text-[11px] font-bold ${
                    network === item.id ? "text-orange-600" : "text-gray-600"
                  }`}
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
              onChange={(event) => {
                setPhone(event.target.value.replace(/\D/g, ""));
              }}
              className="w-full bg-transparent text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
            />

            {phone.length > 0 && (
              <span
                className={`text-xs font-semibold ${
                  phone.length === 11 ? "text-green-500" : "text-gray-400"
                }`}
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

          <div className="scrollbar-hide flex gap-2 overflow-x-auto">
            {loadingBeneficiaries
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-8 w-28 animate-pulse rounded-full bg-gray-200"
                  />
                ))
              : beneficiaries.map((item) => (
                  <button
                    type="button"
                    key={item}
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

      {/* AMOUNT */}
      <div className="px-4 pt-4">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Select Amount
        </p>

        <div className="mb-3 grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map((quickAmount) => (
            <button
              type="button"
              key={quickAmount}
              onClick={() => setAmount(String(quickAmount))}
              className={`rounded-2xl border py-3 text-sm font-bold transition-all ${
                amount === String(quickAmount)
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              ₦{quickAmount.toLocaleString()}
            </button>
          ))}
        </div>

        {/* CUSTOM AMOUNT */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-gray-400">₦</span>

            <input
              type="tel"
              inputMode="numeric"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value.replace(/\D/g, ""));
              }}
              className="w-full bg-transparent text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="mt-1.5 flex justify-between px-1 text-xs text-gray-400">
          <span>Min: ₦50</span>
          <span>Max: ₦50,000</span>
        </div>
      </div>

      {/* SUMMARY */}
      {numericAmount >= MIN_AMOUNT &&
        numericAmount <= MAX_AMOUNT &&
        phone.length === 11 && (
          <div className="mx-4 mt-4 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-500">Network</span>

              <span className="font-semibold text-gray-800">
                {selectedNetwork?.name}
              </span>
            </div>

            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-500">Phone</span>

              <span className="font-semibold text-gray-800">{phone}</span>
            </div>

            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-500">Amount</span>

              <span className="font-bold text-gray-900">
                ₦{numericAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between border-t border-orange-200 pt-2 text-sm">
              <span className="font-semibold text-green-600">1% Cashback</span>

              <span className="font-bold text-green-600">
                +₦{cashbackPreview.toLocaleString()}
              </span>
            </div>
          </div>
        )}

      {/* BUY BUTTON */}
      <div className="mt-4 px-4">
        <button
          type="button"
          onClick={handleReview}
          disabled={loading}
          className="w-full rounded-2xl bg-orange-500 py-4 font-bold text-white shadow-md transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-70"
        >
          Buy Airtime
        </button>
      </div>

      {/* REVIEW MODAL */}
      {showReview && (
        <div className="fixed inset-0 z-[150] flex items-end bg-black/50 backdrop-blur-sm">
          <div className="w-full rounded-t-[28px] bg-white p-5">
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

            <div className="overflow-hidden rounded-2xl bg-gray-50 px-4">
              <div className="flex justify-between py-3">
                <span className="text-sm text-gray-500">Network</span>

                <span className="text-sm font-semibold text-gray-800">
                  {selectedNetwork?.name}
                </span>
              </div>

              <div className="border-b border-dashed border-gray-200" />

              <div className="flex justify-between py-3">
                <span className="text-sm text-gray-500">Phone</span>

                <span className="text-sm font-semibold text-gray-800">
                  {phone}
                </span>
              </div>

              <div className="border-b border-dashed border-gray-200" />

              <div className="flex justify-between py-3">
                <span className="text-sm text-gray-500">Amount</span>

                <span className="text-sm font-semibold text-gray-800">
                  ₦{numericAmount.toLocaleString()}
                </span>
              </div>

              <div className="border-b border-dashed border-gray-200" />

              <div className="flex justify-between py-3">
                <span className="text-sm font-semibold text-green-600">
                  1% Cashback
                </span>

                <span className="text-sm font-bold text-green-600">
                  +₦{cashbackPreview.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                void confirmBuy();
              }}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3.5 font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm & Pay"
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowReview(false)}
              disabled={loading}
              className="mt-2.5 w-full rounded-2xl bg-gray-100 py-3 text-sm font-semibold text-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
