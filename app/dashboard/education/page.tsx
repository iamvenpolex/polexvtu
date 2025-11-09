"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function EducationPage() {
  const [products, setProducts] = useState<
    { provider: string; final_price: string }[]
  >([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type?: string;
  } | null>(null);
  const [pin, setPin] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    console.log("[USER PAGE] Fetching products from API...");
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/education/prices`);
      console.log("[USER PAGE] API response:", res.data);

      if (res.data.success) {
        setProducts(res.data.data);
      } else {
        setMessage({ text: "Failed to load products", type: "error" });
      }
    } catch (err) {
      console.error("[USER PAGE] Error fetching products:", err);
      setMessage({ text: "Failed to load products", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    const product = products.find((p) => p.provider === provider);
    setAmount(product ? product.final_price : "");
  };

  const handleBuy = async () => {
    if (!selectedProvider) {
      setMessage({ text: "Please select a product", type: "error" });
      return;
    }

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      setMessage({ text: "User not logged in", type: "error" });
      return;
    }

    if (!confirm(`Pay ₦${amount} for ${selectedProvider.toUpperCase()}?`))
      return;

    setBuying(true);
    setMessage({ text: "Processing purchase...", type: "success" });
    setPin(null);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/education/buy/${selectedProvider}`,
        { user_id }
      );
      console.log("[USER PAGE] Buy API response:", res.data);

      if (res.data.success) {
        const pinText: string =
          typeof res.data.pin === "string"
            ? res.data.pin
            : JSON.stringify(res.data.pin);

        setMessage({
          text: `Purchase successful! Amount: ₦${res.data.price}`,
          type: "success",
        });
        setPin(pinText);
      } else {
        setMessage({
          text: res.data.message || "Purchase failed",
          type: "error",
        });
      }
    } catch (err) {
      const e = err as AxiosError;
      console.error("[USER PAGE] Buy error:", e.response?.data || e.message);
      setMessage({ text: "Purchase failed", type: "error" });
    } finally {
      setBuying(false);
    }
  };

  return (
    <div style={{ padding: 16, fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center gap-3 px-4 py-3">
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <GraduationCap size={18} className="text-orange-600" />
          Buy Education Pins
        </h1>
      </div>

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
        <p>Loading products...</p>
      ) : (
        <>
          <div style={{ marginBottom: 12 }}>
            <label style={{ color: "#ff8a00", fontWeight: 600 }}>
              Select Product
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => handleProviderChange(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                marginTop: 4,
                color: "Black",
                border: "1px solid #000",
              }}
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.provider} value={p.provider}>
                  {p.provider.toUpperCase()} - ₦{p.final_price}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ color: "#ff8a00", fontWeight: 600 }}>
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              readOnly
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
          </div>

          <button
            onClick={handleBuy}
            disabled={buying || !selectedProvider}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              background: "#ff8a00",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {buying ? "Processing..." : "Pay & Buy"}
          </button>

          {pin && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 8,
                background: "#e6f9ec",
                border: "1px solid #027a36",
                color: "#027a36",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              <span style={{ color: "#ff6b00", fontWeight: 700 }}>Pin:</span>{" "}
              {pin}
            </div>
          )}
        </>
      )}
    </div>
  );
}
