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
  const [filteredPlans, setFilteredPlans] = useState<DataPlan[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ✅ Fetch data plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get<DataPlan[]>(
          `${API_BASE_URL}/api/plan/data`
        );
        setPlans(res.data);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setMessage("❌ Failed to load data plans.");
      }
    };

    fetchPlans();
  }, [API_BASE_URL]);

  // ✅ Filter plans by network
  useEffect(() => {
    if (selectedNetwork) {
      const filtered = plans.filter(
        (plan) => plan.network.toLowerCase() === selectedNetwork.toLowerCase()
      );
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans([]);
    }
  }, [selectedNetwork, plans]);

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
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
          >
            <option value="">Select Network</option>
            {[...new Set(plans.map((p) => p.network))].map((network, idx) => (
              <option key={idx} value={network}>
                {network.toUpperCase()}
              </option>
            ))}
          </select>

          {/* ✅ Select Plan */}
          <select
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            disabled={!selectedNetwork}
          >
            <option value="">Select Plan</option>
            {filteredPlans.map((plan) => (
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
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
          />

          {/* ✅ Buy Button */}
          <button
            onClick={handleBuyData}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70"
          >
            {loading ? "Processing..." : "Buy Data"}
          </button>

          {/* ✅ Feedback Message */}
          {message && (
            <p
              className={`text-center mt-4 font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
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
