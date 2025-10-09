"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DataPlan {
  network: string;
  plan_id: string;
  plan_name: string;
  price: number;
}

export default function BuyDataPage() {
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetching, setFetching] = useState(false);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ✅ Fetch data plans whenever the selected network changes
  useEffect(() => {
    const fetchPlans = async () => {
      if (!selectedNetwork) return; // Only fetch when user selects a network

      setFetching(true);
      setMessage("📡 Fetching EasyAccess data plans...");

      try {
        const res = await axios.get<DataPlan[]>(
          `${API_BASE_URL}/api/plan/data`,
          {
            params: { network: selectedNetwork }, // ✅ Send network to backend
          }
        );

        console.log("✅ EasyAccess response received:", res.data);

        if (Array.isArray(res.data) && res.data.length > 0) {
          setPlans(res.data);
          setMessage("");
        } else {
          setPlans([]);
          setMessage("❌ No plans found or unexpected data format.");
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setMessage("❌ Failed to load data plans.");
      } finally {
        setFetching(false);
      }
    };

    fetchPlans();
  }, [selectedNetwork, API_BASE_URL]);

  // ✅ Handle Buy Data
  const handleBuyData = async () => {
    if (!selectedNetwork || !selectedPlan || !mobile) {
      setMessage("Please select a network, plan, and enter mobile number.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${API_BASE_URL}/api/vtu/buy-data`, {
        userId,
        network: selectedNetwork,
        plan_id: selectedPlan,
        mobile_number: mobile,
      });

      setMessage("✅ Data purchase successful!");
      setMobile("");
      setSelectedNetwork("");
      setSelectedPlan("");
      setPlans([]);
    } catch (err) {
      console.error("Error buying data:", err);
      setMessage("❌ Failed to buy data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 text-black">
      {/* 🔙 Back Button */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* 🧾 Buy Data Card */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-center text-orange-900">
          Buy Data
        </h1>

        <div className="space-y-5">
          {/* ✅ Select Network */}
          <select
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
            value={selectedNetwork}
            onChange={(e) => {
              setSelectedNetwork(e.target.value);
              setPlans([]);
              setSelectedPlan("");
            }}
          >
            <option value="">Select Network</option>
            <option value="MTN">MTN</option>
            <option value="AIRTEL">AIRTEL</option>
            <option value="GLO">GLO</option>
            <option value="9MOBILE">9MOBILE</option>
          </select>

          {/* ✅ Select Plan */}
          <select
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            disabled={!selectedNetwork || fetching}
          >
            <option value="">Select Plan</option>
            {plans.map((plan) => (
              <option key={plan.plan_id} value={plan.plan_id}>
                {plan.plan_name} (₦{plan.price})
              </option>
            ))}
          </select>

          {/* ✅ Enter Mobile Number */}
          <input
            type="text"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none text-black"
          />

          {/* ✅ Buy Button */}
          <button
            onClick={handleBuyData}
            disabled={loading || fetching}
            className="w-full bg-blue-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70"
          >
            {loading
              ? "Processing..."
              : fetching
              ? "Loading plans..."
              : "Buy Data"}
          </button>

          {/* ✅ Feedback Message */}
          {message && (
            <p
              className={`text-center mt-4 font-medium ${
                message.startsWith("✅")
                  ? "text-green-600"
                  : message.startsWith("📡")
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
