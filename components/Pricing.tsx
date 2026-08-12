"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface Plan {
  plan_id: string;
  name: string;
  price: number;
  custom_price?: number;
  validity: string;
}

interface ProductType {
  product_type: string;
  label: string;
}

const NETWORKS = [
  { key: "mtn", label: "MTN" },
  { key: "glo", label: "GLO" },
  { key: "airtel", label: "AIRTEL" },
  { key: "9mobile", label: "9MOBILE" },
];

const PricingSection: React.FC = () => {
  const [network, setNetwork] = useState("mtn");
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);

  // Fetch available product types
  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);

      try {
        const res = await axios.get(
          `${BASE_URL}/api/vtu/plans/types/${network}`,
        );

        const types = res.data.types || [];

        setProductTypes(types);

        if (types.length > 0) {
          setSelectedType(types[0].product_type);
        } else {
          setSelectedType("");
          setPlans([]);
        }
      } catch (error) {
        console.error("Failed to fetch product types:", error);
        setProductTypes([]);
        setPlans([]);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTypes();
  }, [network]);

  // Fetch prices/plans
  useEffect(() => {
    if (!selectedType) return;

    const fetchPlans = async () => {
      setLoadingPlans(true);

      try {
        const res = await axios.get(
          `${BASE_URL}/api/vtu/plans/${selectedType}`,
        );

        setPlans(res.data.plans || []);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
        setPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [selectedType]);

  return (
    <section id="pricing" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-orange-500 font-semibold uppercase tracking-wide text-sm sm:text-base">
            Pricing
          </h3>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-2">
            Check Our Prices Below
          </h2>

          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full" />
        </div>

        {/* Network Selector */}
        <div className="flex justify-center gap-2 mt-8 flex-wrap">
          {NETWORKS.map((item) => (
            <button
              key={item.key}
              onClick={() => setNetwork(item.key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                network === item.key
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Product Types */}
        <div className="flex justify-center gap-2 mt-5 flex-wrap">
          {loadingTypes ? (
            <p className="text-sm text-gray-400">Loading categories...</p>
          ) : (
            productTypes.map((type) => (
              <button
                key={type.product_type}
                onClick={() => setSelectedType(type.product_type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                  selectedType === type.product_type
                    ? "bg-blue-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {type.label}
              </button>
            ))
          )}
        </div>

        {/* Prices */}
        <div className="mt-10">
          {loadingPlans ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 bg-white rounded-xl shadow-sm animate-pulse"
                />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No prices available for this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {plans.map((plan) => {
                const price = plan.custom_price ?? plan.price;

                return (
                  <div
                    key={plan.plan_id}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
                  >
                    <h3 className="text-sm font-semibold text-blue-900">
                      {plan.name}
                    </h3>

                    <p className="text-2xl font-extrabold text-orange-500 mt-2">
                      ₦{price.toLocaleString()}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Validity: {plan.validity}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
