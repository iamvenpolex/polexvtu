"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Wifi, Phone, CheckCircle2, Loader2 } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type Plan = {
  plan_id: string;
  name: string;
  price: number;
  custom_price?: number;
  validity: string;
};

type MessageType = {
  type: "success" | "error";
  text: string;
} | null;

const NETWORKS = [
  {
    key: "mtn",
    label: "MTN",
    logo: "/mtn-mobile-logo-icon.png",
  },
  {
    key: "glo",
    label: "GLO",
    logo: "/glo-logo.png",
  },
  {
    key: "airtel",
    label: "AIRTEL",
    logo: "/Airtel_logo-01.png",
  },
  {
    key: "9mobile",
    label: "9MOBILE",
    logo: "/9mobile-logo.png",
  },
];

const PRODUCT_TYPES = ["gifting", "sme", "awoof", "cg"];

export default function DataPage() {
  const [network, setNetwork] = useState("mtn");
  const [productType, setProductType] = useState("mtn_gifting");

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [phone, setPhone] = useState("");

  const [balance, setBalance] = useState(0);

  const [beneficiaries, setBeneficiaries] = useState<string[]>([]);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [showReview, setShowReview] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<MessageType>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ---------- AUTO REMOVE MESSAGE ----------
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  // ---------- FETCH BALANCE ----------
  useEffect(() => {
    if (!token) return;

    const fetchBalance = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/wallet/balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBalance(response.data.balance || 0);
      } catch {
        console.log("Failed to fetch balance");
      }
    };

    fetchBalance();
  }, [token]);

  // ---------- FETCH PLANS ----------
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);

      try {
        const response = await axios.get(
          `${BASE_URL}/api/vtu/plans/${productType}`,
        );

        setPlans(response.data.plans || []);
      } catch {
        setMessage({
          type: "error",
          text: "Failed to load plans",
        });
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [productType]);

  // ---------- BUY DATA ----------
  const confirmBuy = async () => {
    if (!selectedPlan) return;

    // VALIDATE NUMBER
    if (!/^\d{11}$/.test(phone)) {
      setMessage({
        type: "error",
        text: "Enter a valid 11-digit phone number",
      });

      return;
    }

    const amount = selectedPlan.custom_price || selectedPlan.price;

    // CHECK BALANCE
    if (balance < amount) {
      setMessage({
        type: "error",
        text: "Insufficient wallet balance",
      });

      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const user_id = localStorage.getItem("user_id");

      if (!token || !user_id) {
        setMessage({
          type: "error",
          text: "Please login again",
        });

        return;
      }

      // ---------- NETWORK CODE ----------
      let networkCode = "01";

      if (network === "mtn") networkCode = "01";
      if (network === "glo") networkCode = "02";
      if (network === "airtel") networkCode = "03";
      if (network === "9mobile") networkCode = "04";

      const payload = {
        user_id,
        network: networkCode,
        mobile_no: phone,
        dataplan: selectedPlan.plan_id,
        client_reference: `ref_${Date.now()}`,
      };

      console.log(payload);

      const response = await axios.post(`${BASE_URL}/api/buydata`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      if (response.data.success) {
        setMessage({
          type: "success",
          text: response.data.message || "Data purchase successful",
        });

        // ---------- REFRESH BALANCE ----------
        try {
          const walletRes = await axios.get(`${BASE_URL}/api/wallet/balance`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setBalance(walletRes.data.balance || 0);
        } catch {
          console.log("Failed to refresh balance");
        }

        // ---------- SAVE BENEFICIARY ----------
        setBeneficiaries((prev) => {
          const updated = [phone, ...prev.filter((p) => p !== phone)];

          return updated.slice(0, 5);
        });

        setPhone("");

        setShowReview(false);
      } else {
        setMessage({
          type: "error",
          text: response.data.message || "Transaction failed",
        });
      }
    } catch (error: unknown) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Purchase failed",
        });
      } else {
        setMessage({
          type: "error",
          text: "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* ---------- MESSAGE ---------- */}
      {message && (
        <div
          className={`fixed top-5 left-1/2 z-[100] -translate-x-1/2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur-md transition-all
          ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ---------- HEADER ---------- */}
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

      {/* ---------- NETWORK SELECTOR ---------- */}
      <div className="px-4 pt-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {NETWORKS.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setNetwork(item.key);
                setProductType(`${item.key}_gifting`);
              }}
              className={`min-w-[88px] rounded-2xl border-2 p-3 transition-all
              ${
                network === item.key
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                  <Image
                    src={item.logo}
                    alt={item.label}
                    width={42}
                    height={42}
                    className="object-contain"
                  />
                </div>

                <span
                  className={`text-xs font-bold
                  ${
                    network === item.key ? "text-orange-600" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- PRODUCT TYPE ---------- */}
      <div className="sticky top-[73px] z-40 mt-4 border-y border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {PRODUCT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setProductType(`${network}_${type}`)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-all
              ${
                productType.includes(type)
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- PHONE INPUT ---------- */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-2 text-orange-500">
              <Phone size={18} />
            </div>

            <input
              type="tel"
              inputMode="numeric"
              maxLength={11}
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setPhone(value);
              }}
              className="w-full bg-transparent text-base font-medium text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* ---------- BENEFICIARIES ---------- */}
      {beneficiaries.length > 0 && (
        <div className="px-4 pt-4">
          <p className="mb-2 text-sm font-semibold text-gray-500">
            Recent Numbers
          </p>

          <div className="flex gap-2 overflow-x-auto">
            {beneficiaries.map((item, index) => (
              <button
                key={index}
                onClick={() => setPhone(item)}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-200"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- PLANS ---------- */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-5 md:grid-cols-3">
        {loadingPlans
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-3xl bg-white p-4 shadow-sm"
              >
                <div className="mb-3 h-4 w-20 rounded bg-gray-200" />

                <div className="mb-2 h-6 w-16 rounded bg-gray-200" />

                <div className="h-3 w-24 rounded bg-gray-200" />
              </div>
            ))
          : plans.map((plan) => (
              <div
                key={plan.plan_id}
                className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="rounded-full bg-orange-100 p-2 text-orange-500">
                    <Wifi size={15} />
                  </div>

                  <span className="text-[11px] font-semibold text-gray-400">
                    {plan.validity}
                  </span>
                </div>

                <h3 className="line-clamp-2 text-sm font-bold text-gray-800">
                  {plan.name}
                </h3>

                <p className="mt-2 text-lg font-extrabold text-orange-500">
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
                  className="mt-4 flex w-full items-center justify-center rounded-2xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-600"
                >
                  Buy Now
                </button>
              </div>
            ))}
      </div>

      {/* ---------- REVIEW MODAL ---------- */}
      {showReview && selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-end bg-black/40 backdrop-blur-sm">
          <div className="w-full rounded-t-[30px] bg-white p-5 animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-gray-300" />

            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 text-green-600">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Confirm Purchase
                </h2>

                <p className="text-sm text-gray-500">
                  Review transaction details
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-gray-50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Network</span>

                <span className="font-semibold text-gray-800 uppercase">
                  {network}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Phone Number</span>

                <span className="font-semibold text-gray-800">{phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Plan</span>

                <span className="font-semibold text-gray-800">
                  {selectedPlan.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Validity</span>

                <span className="font-semibold text-gray-800">
                  {selectedPlan.validity}
                </span>
              </div>

              <div className="flex justify-between">
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
              className="mt-5 flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3 font-semibold text-white transition-all hover:bg-orange-600 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Confirm Purchase"
              )}
            </button>

            <button
              onClick={() => setShowReview(false)}
              className="mt-3 w-full rounded-2xl bg-gray-100 py-3 font-semibold text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
