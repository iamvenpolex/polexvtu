"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type Provider = "waec" | "neco" | "nabteb" | "nbais";

type PriceData = {
  provider: Provider;
  final_price: number;
};

export default function AdminEducationPage() {
  const [prices, setPrices] = useState<Record<Provider, number>>({
    waec: 0,
    neco: 0,
    nabteb: 0,
    nbais: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type?: string;
  } | null>(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/education/prices`);
      if (res.data.success) {
        const fetched: Record<Provider, number> = {
          waec: 0,
          neco: 0,
          nabteb: 0,
          nbais: 0,
        };
        res.data.data.forEach((p: PriceData) => {
          fetched[p.provider] = Number(p.final_price);
        });
        setPrices(fetched);
      } else {
        setMessage({ text: "Failed to fetch prices", type: "error" });
      }
    } catch (err) {
      console.error("Fetch prices error:", (err as AxiosError).message);
      setMessage({ text: "Failed to fetch prices", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (provider: Provider, value: string) => {
    setPrices((prev) => ({ ...prev, [provider]: Number(value) }));
  };

  const handleSave = async (provider: Provider) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await axios.put(
        `${BASE_URL}/api/education/prices/${provider}`,
        {
          price: prices[provider],
        }
      );
      if (res.data.success) {
        setMessage({
          text: `${provider.toUpperCase()} price updated successfully`,
          type: "success",
        });
      } else {
        setMessage({
          text: res.data.message || "Failed to update price",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Update price error:", (err as AxiosError).message);
      setMessage({ text: "Failed to update price", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 16, fontFamily: "Inter, sans-serif" }}>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
      >
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      <h1
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#ff6b00",
          margin: "16px 0",
        }}
      >
        Admin: Set Education Pin Prices
      </h1>

      {message && (
        <div
          style={{
            margin: "12px 0",
            padding: 12,
            borderRadius: 8,
            background: message.type === "error" ? "#ffe9e6" : "#e6f9ec",
            color: message.type === "error" ? "#b00000" : "#027a36",
            fontWeight: 600,
          }}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p>Loading prices...</p>
      ) : (
        (["waec", "neco", "nabteb", "nbais"] as Provider[]).map((provider) => (
          <div key={provider} style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", fontWeight: 600, color: "#ff8a00" }}
            >
              {provider.toUpperCase()} Price (₦)
            </label>
            <input
              type="number"
              value={prices[provider]}
              onChange={(e) => handlePriceChange(provider, e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                marginTop: 4,
                border: "1px solid #000",
                fontWeight: 500,
                color: "#000",
              }}
            />
            <button
              onClick={() => handleSave(provider)}
              disabled={saving}
              style={{
                marginTop: 8,
                width: "100%",
                padding: 12,
                borderRadius: 8,
                background: "#ff8a00",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {saving ? "Saving..." : `Save ${provider.toUpperCase()}`}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
