"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Plan {
  id: number;
  plan_name: string;
  plan_code: string;
  selling_price: number;
  validity: string;
  provider_id: number;
}

interface Provider {
  id: number;
  name: string;
}

// Determine base URL: use local in dev, Railway in prod
const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://polexvtu-backend-production.up.railway.app";

export default function BuyDataPage() {
  const [providers] = useState<Provider[]>([
    { id: 1, name: "MTN" },
    { id: 2, name: "Airtel" },
    { id: 3, name: "GLO" },
    { id: 4, name: "9Mobile" },
  ]);

  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!selectedProvider) return;

    const fetchPlans = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/plan?provider_id=${selectedProvider}`
        );
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to load data plans.", err);
        setPlans([]);
      }
    };

    fetchPlans();
  }, [selectedProvider]);

  return (
    <div className="max-w-md mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-orange-500">Buy Data</h1>

      <label className="block mb-2 text-black font-semibold">
        Select Network
      </label>
      <select
        className="w-full p-2 border border-gray-300 text-black    rounded mb-4"
        value={selectedProvider ?? ""}
        onChange={(e) => setSelectedProvider(Number(e.target.value))}
      >
        <option value="">-- Choose Network --</option>
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <label className="block mb-2 text-black  font-semibold">
        Select Data Plan
      </label>
      <select
        className="w-full p-2 border border-gray-300 text-black  rounded mb-4"
        disabled={!plans.length}
      >
        <option value="">-- Choose Plan --</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.plan_code}>
            {plan.plan_name} - ₦{plan.selling_price} ({plan.validity})
          </option>
        ))}
      </select>

      <label className="block mb-2 text-black  font-semibold">
        Phone Number
      </label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 text-black  rounded mb-4"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number"
      />

      <button className="w-full bg-orange-500 text-white p-2 rounded font-semibold">
        Buy Data
      </button>

      {!plans.length && selectedProvider && (
        <p className="mt-2 text-red-500 font-semibold">
          ❌ Failed to load data plans.
        </p>
      )}
    </div>
  );
}
