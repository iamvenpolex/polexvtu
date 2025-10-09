"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// ✅ Define the shape of each data plan
interface DataPlan {
  network: string;
  plan_id: string;
  plan_name: string;
  price: number;
}

export default function BuyDataPage() {
  // ✅ Component state
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Retrieve user ID from localStorage
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // ✅ Fetch available data plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get<DataPlan[]>(
          "https://polexvtu-backend-production.up.railway.app/api/plan/data"
        );
        setPlans(res.data);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setMessage("❌ Failed to load data plans.");
      }
    };

    fetchPlans();
  }, []);

  // ✅ Handle “Buy Data” button click
  const handleBuyData = async () => {
    if (!selectedPlan || !mobile) {
      setMessage("Please select a plan and enter a mobile number.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "https://polexvtu-backend-production.up.railway.app/api/vtu/buy-data",
        {
          userId,
          network: selectedPlan.split("-")[0],
          plan_id: selectedPlan.split("-")[1],
          mobile_number: mobile,
        }
      );

      setMessage("✅ Data purchase successful!");
      setMobile("");
      setSelectedPlan("");
    } catch (err) {
      console.error("Error buying data:", err);
      setMessage("❌ Failed to buy data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ JSX UI
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Buy Data</h1>

      <div className="space-y-4">
        {/* Select Data Plan */}
        <select
          className="w-full border rounded p-2"
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
        >
          <option value="">Select Plan</option>
          {plans.map((plan, idx) => (
            <option key={idx} value={`${plan.network}-${plan.plan_id}`}>
              {plan.network.toUpperCase()} — {plan.plan_name} (₦{plan.price})
            </option>
          ))}
        </select>

        {/* Enter Mobile Number */}
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full border rounded p-2"
        />

        {/* Buy Button */}
        <button
          onClick={handleBuyData}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          {loading ? "Processing..." : "Buy Data"}
        </button>

        {/* Feedback Message */}
        {message && (
          <p
            className={`text-center mt-4 ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
