"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Plan {
  plan_id: string;
  name: string;
  price: number; // EA price from EasyAccess API (static)
  validity: string;
  custom_price?: number; // editable
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
          `${BASE_URL}/api/vtu/plans/${productType}`
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

  // Handle custom price change
  const handlePriceChange = (planId: string, value: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.plan_id === planId
          ? { ...p, custom_price: value === "" ? undefined : Number(value) }
          : p
      )
    );
  };

  // Filtered plans by search term
  const filteredPlans = useMemo(() => {
    return plans.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [plans, searchTerm]);

  // Save all custom prices in bulk
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

      alert("All custom prices saved successfully!");
    } catch (err) {
      console.error("saveAllPrices error:", err);
      alert("Failed to save custom prices.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">
        Admin Data Price Management
      </h1>

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div>
          <label className="mr-2 font-semibold">Product Type:</label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {PRODUCT_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {pt.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-1 rounded w-56"
          />
        </div>

        <button
          onClick={saveAllPrices}
          disabled={saving}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "Saving All..." : "💾 Save All Changes"}
        </button>
      </div>

      {loading ? (
        <p>Loading plans...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-orange-100 text-sm md:text-base">
                <th className="border px-3 py-2">Plan Name</th>
                <th className="border px-3 py-2">EA Price</th>
                <th className="border px-3 py-2">Custom Price</th>
                <th className="border px-3 py-2">Difference</th>
                <th className="border px-3 py-2">Displayed Price</th>
                <th className="border px-3 py-2">Validity</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan) => {
                const difference =
                  plan.custom_price != null
                    ? plan.custom_price - plan.price
                    : 0;
                const diffColor =
                  difference > 0
                    ? "text-green-600"
                    : difference < 0
                    ? "text-red-600"
                    : "text-gray-500";

                return (
                  <tr key={plan.plan_id} className="hover:bg-orange-50">
                    <td className="border px-3 py-2">{plan.name}</td>
                    <td className="border px-3 py-2">₦{plan.price}</td>
                    <td className="border px-3 py-2">
                      <input
                        type="number"
                        value={plan.custom_price ?? ""}
                        onChange={(e) =>
                          handlePriceChange(plan.plan_id, e.target.value)
                        }
                        className="border px-2 py-1 w-24"
                      />
                    </td>
                    <td className={`border px-3 py-2 ${diffColor}`}>
                      {difference === 0
                        ? "—"
                        : difference > 0
                        ? `+₦${difference}`
                        : `₦${difference}`}
                    </td>
                    <td className="border px-3 py-2">
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
