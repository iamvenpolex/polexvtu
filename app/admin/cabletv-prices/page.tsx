"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CablePlan {
  plan_id: string;
  name: string;
  price: number;
  validity: string;
  customPrice?: number; // backend field
  custom_price?: number; // frontend field
}

const CABLE_COMPANIES = ["dstv", "gotv", "startimes", "showmax"] as const;
type CableCompany = (typeof CABLE_COMPANIES)[number];

export default function AdminCableTVPrices() {
  const [company, setCompany] = useState<CableCompany>("dstv");
  const [plans, setPlans] = useState<CablePlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlans() {
      try {
        setLoading(true);
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : "";

        const res = await axios.get<{
          success: boolean;
          plans: CablePlan[];
        }>(`${BASE_URL}/api/cabletv/${company}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        // ✅ Remove ANY and properly type map()
        const formattedPlans: CablePlan[] = res.data.plans.map((plan) => ({
          plan_id: plan.plan_id,
          name: plan.name,
          price: plan.price,
          validity: plan.validity,
          custom_price: plan.customPrice ?? plan.price,
        }));

        setPlans(formattedPlans);
      } catch (error) {
        console.error("fetchPlans error:", error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlans();
  }, [company]);

  const handlePriceChange = (planId: string, value: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.plan_id === planId
          ? { ...plan, custom_price: value ? Number(value) : undefined }
          : plan
      )
    );
  };

  const saveCustomPrice = async (plan: CablePlan) => {
    if (plan.custom_price === undefined) {
      alert("Custom price cannot be empty!");
      return;
    }

    setSavingPlanId(plan.plan_id);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${BASE_URL}/api/cabletv/admin/setCustomPrice`,
        {
          company_code: company,
          package_code: plan.plan_id,
          custom_price: plan.custom_price,
        },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } }
      );

      alert("Custom price saved!");
    } catch (error) {
      console.error("saveCustomPrice error:", error);
      alert("Failed to save custom price");
    } finally {
      setSavingPlanId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">
        Admin CableTV Price Management
      </h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Company:</label>
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value as CableCompany)}
          className="border px-2 py-1 rounded"
        >
          {CABLE_COMPANIES.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
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
