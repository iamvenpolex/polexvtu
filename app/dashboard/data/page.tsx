"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface DataPlan {
  plan_id: string;
  network: string;
  plan_name: string;
  price: number;
}

export default function DataPage() {
  const [plans, setPlans] = useState<DataPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/plan/data`
        );
        setPlans(res.data);
      } catch (err) {
        console.error("❌ Failed to load data plans:", err);
        setError("Failed to load data plans.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, []);

  if (loading) return <p>Loading plans...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Available Data Plans</h1>

      <table className="w-full border border-gray-300 rounded-lg text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Network</th>
            <th className="p-2 border">Plan Name</th>
            <th className="p-2 border">Price (₦)</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.plan_id}>
              <td className="p-2 border">{plan.network}</td>
              <td className="p-2 border">{plan.plan_name}</td>
              <td className="p-2 border">₦{plan.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
