"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Wifi,
  Phone,
  CheckCircle2,
  Loader2,
  XCircle,
  Clock,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type Plan = {
  plan_id: string;
  name: string;
  price: number;
  custom_price?: number;
  validity: string;
};

type ProductType = {
  product_type: string;
  label: string;
};

type ReceiptStatus = "success" | "failed" | "pending";

type Receipt = {
  status: ReceiptStatus;
  plan: Plan;
  phone: string;
  network: string;
  amount: number;
  reference: string;
  timestamp: string;
  message: string;
};

type MessageType = { type: "success" | "error"; text: string } | null;

const NETWORKS = [
  { key: "mtn", label: "MTN", logo: "/mtn-mobile-logo-icon.png", code: 1 },
  { key: "glo", label: "GLO", logo: "/glo-logo.png", code: 2 },
  { key: "airtel", label: "AIRTEL", logo: "/Airtel_logo-01.png", code: 3 },
  { key: "9mobile", label: "9MOBILE", logo: "/9mobile-logo.png", code: 4 },
];

const ALL_PRODUCT_TYPES = ["gifting", "sme", "cg_lite", "cg", "awoof"];

export default function DataPage() {
  const [network, setNetwork] = useState("mtn");
  const [productType, setProductType] = useState("mtn_gifting");
  const [availableTypes, setAvailableTypes] = useState<ProductType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [phone, setPhone] = useState("");
  const [balance, setBalance] = useState(0);

  // Beneficiaries fetched from DB (past purchases)
  const [beneficiaries, setBeneficiaries] = useState<string[]>([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageType>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user_id =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  // ---------- AUTO REMOVE MESSAGE ----------
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  // ---------- FETCH BALANCE ----------
  useEffect(() => {
    if (!token) return;
    const run = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/wallet/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance || 0);
      } catch {
        console.log("Failed to fetch balance");
      }
    };
    run();
  }, [token]);

  // ---------- FETCH BENEFICIARIES FROM DB ----------
  useEffect(() => {
    if (!token || !user_id) return;
    setLoadingBeneficiaries(true);
    const run = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/buydata/beneficiaries?user_id=${user_id}&type=data`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setBeneficiaries(res.data.phones || []);
      } catch {
        setBeneficiaries([]);
      } finally {
        setLoadingBeneficiaries(false);
      }
    };
    run();
  }, [token, user_id]);

  // ---------- FETCH AVAILABLE TYPES ----------
  useEffect(() => {
    setLoadingTypes(true);
    setAvailableTypes([]);
    setPlans([]);
    const run = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/vtu/plans/types/${network}`,
        );
        const types: ProductType[] = res.data.types || [];
        setAvailableTypes(types);
        if (types.length > 0) setProductType(types[0].product_type);
      } catch {
        const fallback = ALL_PRODUCT_TYPES.map((t) => ({
          product_type: `${network}_${t}`,
          label: t.replace(/_/g, " "),
        }));
        setAvailableTypes(fallback);
        setProductType(`${network}_gifting`);
      } finally {
        setLoadingTypes(false);
      }
    };
    run();
  }, [network]);

  // ---------- FETCH PLANS ----------
  useEffect(() => {
    if (!productType) return;
    let cancelled = false;
    const run = async () => {
      setLoadingPlans(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/vtu/plans/${productType}`);
        if (!cancelled) setPlans(res.data.plans || []);
      } catch {
        if (!cancelled)
          setMessage({ type: "error", text: "Failed to load plans" });
      } finally {
        if (!cancelled) setLoadingPlans(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [productType]);

  // ---------- BUY DATA ----------
  const confirmBuy = async () => {
    if (!selectedPlan) return;
    if (!/^\d{11}$/.test(phone)) {
      setShowReview(false);
      setMessage({
        type: "error",
        text: "Enter a valid 11-digit phone number",
      });
      return;
    }

    const amount = selectedPlan.custom_price || selectedPlan.price;
    if (balance < amount) {
      setShowReview(false);
      setMessage({ type: "error", text: "Insufficient wallet balance" });
      return;
    }

    setLoading(true);

    try {
      const tok = localStorage.getItem("token");
      const uid = localStorage.getItem("user_id");
      if (!tok || !uid) {
        setMessage({ type: "error", text: "Please login again" });
        return;
      }

      const networkObj = NETWORKS.find((n) => n.key === network);
      const networkCode = networkObj?.code ?? 1;
      const reference = `ref_${Date.now()}`;

      const response = await axios.post(
        `${BASE_URL}/api/buydata`,
        {
          user_id: uid,
          network: networkCode,
          mobile_no: phone,
          dataplan: selectedPlan.plan_id,
          client_reference: reference,
        },
        { headers: { Authorization: `Bearer ${tok}` } },
      );

      const resData = response.data;
      const txStatus: ReceiptStatus =
        resData.status || (resData.success ? "success" : "failed");

      setReceipt({
        status: txStatus,
        plan: selectedPlan,
        phone,
        network: network.toUpperCase(),
        amount,
        reference: resData.reference || reference,
        timestamp: new Date().toLocaleString("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        message:
          resData.message ||
          (txStatus === "success"
            ? "Data purchase successful"
            : "Transaction failed"),
      });

      setShowReview(false);

      if (txStatus === "success") {
        // Refresh balance
        try {
          const walletRes = await axios.get(`${BASE_URL}/api/wallet/balance`, {
            headers: { Authorization: `Bearer ${tok}` },
          });
          setBalance(walletRes.data.balance || 0);
        } catch {
          /* non-critical */
        }

        // Refresh beneficiaries from DB
        try {
          const benRes = await axios.get(
            `${BASE_URL}/api/buydata/beneficiaries?user_id=${uid}&type=data`,
            { headers: { Authorization: `Bearer ${tok}` } },
          );
          setBeneficiaries(benRes.data.phones || []);
        } catch {
          /* non-critical */
        }

        setPhone("");
      }
    } catch (error: unknown) {
      let errMsg = "Something went wrong";
      if (axios.isAxiosError(error)) {
        errMsg = error.response?.data?.message || "Purchase failed";
      }
      setReceipt({
        status: "failed",
        plan: selectedPlan!,
        phone,
        network: network.toUpperCase(),
        amount: selectedPlan!.custom_price || selectedPlan!.price,
        reference: `ref_${Date.now()}`,
        timestamp: new Date().toLocaleString("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        message: errMsg,
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
    const zigzagColor = isSuccess
      ? "bg-orange-500"
      : isPending
        ? "bg-yellow-500"
        : "bg-red-500";

    return (
      <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
        {/* Top band */}
        <div
          className={`flex flex-col items-center justify-center pt-16 pb-12 px-6 ${bandColor}`}
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
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
          <p className="mt-2 max-w-xs text-center text-sm text-white/80 leading-relaxed">
            {receipt.message}
          </p>
        </div>

        {/* Receipt card */}
        <div className="mx-4 -mt-5 rounded-3xl bg-white shadow-xl overflow-hidden">
          {/* Zigzag top */}
          <div className="flex h-4 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${zigzagColor}`}
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
              { label: "Plan", value: receipt.plan.name },
              { label: "Validity", value: receipt.plan.validity },
              {
                label: "Amount Paid",
                value: `₦${receipt.amount.toLocaleString()}`,
                bold: true,
              },
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
                      row.mono
                        ? "font-mono text-xs text-gray-500"
                        : row.bold
                          ? "font-extrabold text-gray-900"
                          : row.colored
                            ? row.colored === "success"
                              ? "font-bold text-green-600"
                              : row.colored === "pending"
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

          {/* Zigzag bottom */}
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

        {/* Actions */}
        <div className="px-4 mt-6 pb-10 space-y-3">
          <button
            onClick={() => {
              setReceipt(null);
              setSelectedPlan(null);
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
      {/* MESSAGE TOAST */}
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
              <h1 className="text-lg font-bold text-gray-900">Buy Data</h1>
              <p className="text-xs text-gray-500">Fast & instant delivery</p>
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
              key={item.key}
              onClick={() => setNetwork(item.key)}
              className={`min-w-[80px] rounded-2xl border-2 p-3 transition-all ${
                network === item.key
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-gray-100">
                  <Image
                    src={item.logo}
                    alt={item.label}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <span
                  className={`text-[11px] font-bold ${network === item.key ? "text-orange-600" : "text-gray-600"}`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT TYPE TABS */}
      <div className="sticky top-[73px] z-40 mt-3 border-y border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="flex gap-2 overflow-x-auto px-4 py-2.5 scrollbar-hide">
          {loadingTypes
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 animate-pulse rounded-full bg-gray-100"
                />
              ))
            : availableTypes.map((t) => (
                <button
                  key={t.product_type}
                  onClick={() => setProductType(t.product_type)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-all ${
                    productType === t.product_type
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t.label}
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
          </div>
        </div>
      </div>

      {/* BENEFICIARIES FROM DB */}
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
              : beneficiaries.map((item, index) => (
                  <button
                    key={index}
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

      {/* PLANS GRID — 3 per row */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-2.5">
          {loadingPlans ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white p-3 shadow-sm"
              >
                <div className="mb-2 h-3 w-14 rounded bg-gray-200" />
                <div className="mb-1.5 h-5 w-10 rounded bg-gray-200" />
                <div className="h-2.5 w-16 rounded bg-gray-200" />
                <div className="mt-3 h-7 w-full rounded-xl bg-gray-200" />
              </div>
            ))
          ) : plans.length === 0 ? (
            <div className="col-span-3 py-16 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Wifi size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                No plans available
              </p>
              <p className="mt-1 text-xs text-gray-400">
                This category has no active plans
              </p>
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.plan_id}
                className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all active:scale-95"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="rounded-lg bg-orange-50 p-1.5 text-orange-500">
                    <Wifi size={12} />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400">
                    {plan.validity}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-xs font-bold leading-snug text-gray-800">
                  {plan.name}
                </h3>
                <p className="mt-1.5 text-base font-extrabold text-orange-500">
                  ₦{(plan.custom_price || plan.price).toLocaleString()}
                </p>
                <button
                  onClick={() => {
                    if (!/^\d{11}$/.test(phone)) {
                      setMessage({
                        type: "error",
                        text: "Enter a valid 11-digit phone number",
                      });
                      return;
                    }
                    setSelectedPlan(plan);
                    setShowReview(true);
                  }}
                  className="mt-2.5 w-full rounded-xl bg-orange-500 py-2 text-xs font-bold text-white transition-all hover:bg-orange-600 active:scale-95"
                >
                  Buy
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* REVIEW MODAL */}
      {showReview && selectedPlan && (
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

            <div className="space-y-0 rounded-2xl bg-gray-50 px-4 overflow-hidden">
              {[
                { label: "Network", value: network.toUpperCase() },
                { label: "Phone", value: phone },
                { label: "Plan", value: selectedPlan.name },
                { label: "Validity", value: selectedPlan.validity },
              ].map((row, i) => (
                <div key={i}>
                  <div className="flex justify-between py-3">
                    <span className="text-sm text-gray-500">{row.label}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {row.value}
                    </span>
                  </div>
                  <div className="border-b border-dashed border-gray-200" />
                </div>
              ))}
              <div className="flex justify-between py-3">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-lg font-extrabold text-orange-500">
                  ₦
                  {(
                    selectedPlan.custom_price || selectedPlan.price
                  ).toLocaleString()}
                </span>
              </div>
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
