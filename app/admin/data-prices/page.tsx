"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Plan {
  plan_id: string;
  name: string;
  price: number; // provider price
  validity: string;
  custom_price?: number;
}

const PRODUCT_TYPES = [
  "mtn_sme",
  "mtn_cg_lite",
  "mtn_cg",
  "mtn_awoof",
  "mtn_gifting",
  "glo_cg",
  "glo_awoof",
  "glo_gifting",
  "airtel_cg",
  "airtel_awoof",
  "airtel_gifting",
  "9mobile_sme",
  "9mobile_gifting",
];

const MIN_MARGIN = 5;

export default function AdminDataPrices() {
  const [productType, setProductType] = useState("mtn_sme");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch plans
  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      try {
        const res = await axios.get<{ plans: Plan[] }>(
          `${BASE_URL}/api/vtu/plans/${productType}`,
        );
        setPlans(res.data.plans || []);
      } catch (err) {
        console.error("fetchPlans error:", err);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, [productType]);

  // Enforce minimum margin rule
  const handlePriceChange = (plan: Plan, value: string) => {
    const numeric = Number(value);

    const minAllowed = plan.price + MIN_MARGIN;

    setPlans((prev) =>
      prev.map((p) => {
        if (p.plan_id !== plan.plan_id) return p;

        // empty input
        if (value === "") return { ...p, custom_price: undefined };

        // enforce rule
        if (numeric < minAllowed) {
          return { ...p, custom_price: minAllowed };
        }

        return { ...p, custom_price: numeric };
      }),
    );
  };

  // Filter plans
  const filteredPlans = useMemo(() => {
    return plans.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [plans, searchTerm]);

  // Save
  const saveAllPrices = async () => {
    const updatedPlans = plans.filter((p) => p.custom_price != null);

    if (updatedPlans.length === 0) {
      alert("No custom prices to save.");
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${BASE_URL}/api/vtu/plans/custom-price/bulk`, {
        product_type: productType,
        plans: updatedPlans.map((p) => ({
          plan_id: p.plan_id,
          plan_name: p.name,
          custom_price: p.custom_price,
          status: "active",
        })),
      });

      alert("Prices saved successfully!");
    } catch (err) {
      console.error("saveAllPrices error:", err);
      alert("Failed to save prices.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">
        Data Price Management
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {PRODUCT_TYPES.map((pt) => (
            <option key={pt} value={pt}>
              {pt.toUpperCase()}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <button
          onClick={saveAllPrices}
          disabled={saving}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading plans...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-orange-100">
                <th className="border px-3 py-2 text-left">Plan</th>
                <th className="border px-3 py-2">Provider</th>
                <th className="border px-3 py-2">Custom</th>
                <th className="border px-3 py-2">Profit</th>
                <th className="border px-3 py-2">Final</th>
                <th className="border px-3 py-2">Validity</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlans.map((plan) => {
                const profit = (plan.custom_price ?? plan.price) - plan.price;

                return (
                  <tr key={plan.plan_id} className="hover:bg-orange-50">
                    <td className="border px-3 py-2 font-medium">
                      {plan.name}
                    </td>

                    <td className="border px-3 py-2">₦{plan.price}</td>

                    <td className="border px-3 py-2">
                      <input
                        type="number"
                        value={plan.custom_price ?? ""}
                        onChange={(e) =>
                          handlePriceChange(plan, e.target.value)
                        }
                        className="border px-2 py-1 w-24 rounded"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Min ₦{plan.price + MIN_MARGIN}
                      </p>
                    </td>

                    <td
                      className={`border px-3 py-2 font-semibold ${
                        profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {profit > 0 ? `+₦${profit}` : `₦${profit}`}
                    </td>

                    <td className="border px-3 py-2 font-bold">
                      ₦{plan.custom_price ?? plan.price}
                    </td>

                    <td className="border px-3 py-2">{plan.validity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
