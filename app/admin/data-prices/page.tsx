"use client";

import { useEffect, useState } from "react";
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
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);

  // Fetch plans from backend
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

  // Save custom price to backend
  const saveCustomPrice = async (plan: Plan) => {
    if (plan.custom_price == null) {
      alert("Custom price cannot be empty!");
      return;
    }

    setSavingPlanId(plan.plan_id);

    try {
      await axios.post(`${BASE_URL}/api/vtu/plans/custom-price`, {
        product_type: productType,
        plan_id: plan.plan_id,
        plan_name: plan.name,
        custom_price: plan.custom_price,
        status: "active",
      });
      alert("Custom price saved!");
    } catch (err) {
      console.error("saveCustomPrice error:", err);
      alert("Failed to save custom price");
    } finally {
      setSavingPlanId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">
        Admin Data Price Management
      </h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Product Type:</label>
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

      {loading ? (
        <p>Loading plans...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-100">
              <th className="border px-3 py-1">Plan Name</th>
              <th className="border px-3 py-1">EA Price</th>
              <th className="border px-3 py-1">Custom Price</th>
              <th className="border px-3 py-1">Displayed Price</th>
              <th className="border px-3 py-1">Validity</th>
              <th className="border px-3 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.plan_id} className="hover:bg-orange-50">
                <td className="border px-3 py-1">{plan.name}</td>
                <td className="border px-3 py-1">₦{plan.price}</td>
                <td className="border px-3 py-1">
                  <input
                    type="number"
                    value={plan.custom_price ?? ""}
                    onChange={(e) =>
                      handlePriceChange(plan.plan_id, e.target.value)
                    }
                    className="border px-2 py-1 w-24"
                  />
                </td>
                <td className="border px-3 py-1">
                  ₦{plan.custom_price ?? plan.price}
                </td>
                <td className="border px-3 py-1">{plan.validity}</td>
                <td className="border px-3 py-1">
                  <button
                    onClick={() => saveCustomPrice(plan)}
                    disabled={savingPlanId === plan.plan_id}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    {savingPlanId === plan.plan_id ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
