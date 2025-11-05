"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { ArrowLeft, Lightbulb } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const COMPANIES = [
  { code: "01", name: "Eko Electricity - EKEDC(PHCN)" },
  { code: "02", name: "Ikeja Electricity - IKEDC(PHCN)" },
  { code: "03", name: "PortHarcourt Electricity - PHEDC" },
  { code: "04", name: "Kaduna Electricity - KAEDC" },
  { code: "05", name: "Abuja Electricity - AEDC" },
  { code: "06", name: "Ibadan Electricity - IBEDC" },
  { code: "07", name: "Kano Electricity - KEDC" },
  { code: "08", name: "Jos Electricity - JEDC" },
  { code: "09", name: "Enugu Electricity - EEDC" },
  { code: "10", name: "Benin Electricity - BEDC" },
  { code: "11", name: "Aba Electricity - ABA" },
  { code: "12", name: "Yola Electricity - YEDC" },
];

const METER_TYPES = [
  { code: "01", name: "PREPAID" },
  { code: "02", name: "POSTPAID" },
];

export default function ElectricityPage() {
  const [company, setCompany] = useState("");
  const [metertype, setMetertype] = useState("01");
  const [meterno, setMeterno] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type?: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleVerify = async () => {
    if (!company || !meterno || !amount) {
      setMessage({ text: "All fields are required", type: "error" });
      setModalOpen(true);
      return;
    }

    setLoading(true);
    setMessage(null);
    setCustomerName(null);

    try {
      const res = await axios.post(`${BASE_URL}/api/electricity/verify`, {
        company,
        metertype,
        meterno,
        amount: Number(amount),
      });

      if (res.data.success) {
        setCustomerName(res.data.customer_name || null);
        setMessage({ text: "Meter verified successfully!", type: "success" });
      } else {
        setMessage({
          text: res.data.message || "Verification failed",
          type: "error",
        });
      }
      setModalOpen(true);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error(err.response?.data || err.message);
      setMessage({
        text: err.response?.data?.message || "Please try again",
        type: "error",
      });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!company || !meterno || !amount) {
      setMessage({ text: "All fields are required", type: "error" });
      setModalOpen(true);
      return;
    }

    if (Number(amount) < 1000) {
      setMessage({ text: "Minimum amount is ₦1000", type: "error" });
      setModalOpen(true);
      return;
    }

    if (
      !confirm(
        `Pay ₦${amount} to ${COMPANIES.find((c) => c.code === company)?.name}?`
      )
    )
      return;

    setLoading(true);
    setMessage(null);
    setToken(null);

    try {
      const user_id = localStorage.getItem("user_id");
      const res = await axios.post(`${BASE_URL}/api/electricity/pay`, {
        user_id,
        company,
        metertype,
        meterno,
        amount: Number(amount),
      });

      if (res.data.success) {
        setToken(res.data.token);
        setMessage({ text: "Payment successful!", type: "success" });
      } else {
        let friendlyMessage = res.data.message;
        if (res.data.message?.toLowerCase().includes("insufficient balance")) {
          friendlyMessage =
            "Your wallet balance is too low. Please top up and try again.";
        }
        setMessage({
          text: friendlyMessage || "Payment failed",
          type: "error",
        });
      }
      setModalOpen(true);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error(err.response?.data || err.message);
      let friendlyMessage = err.response?.data?.message || "Please try again";
      if (friendlyMessage.toLowerCase().includes("insufficient balance")) {
        friendlyMessage =
          "Your wallet balance is too low. Please top up and try again.";
      }
      setMessage({ text: friendlyMessage, type: "error" });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadToken = () => {
    if (!token) return;
    const blob = new Blob([token], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meter_token_${meterno}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{ padding: 16, fontFamily: "Inter, sans-serif", color: "#1a1a1a" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm mb-4">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Lightbulb size={18} className="text-orange-600" />
            Pay Electricity Bills
          </h1>
        </div>
      </header>

      {/* Form */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: "#ff8a00", fontWeight: 600 }}>Company</label>
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            marginTop: 4,
            border: "1px solid #000",
          }}
        >
          <option value="">-- Select Company --</option>
          {COMPANIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ color: "#ff8a00", fontWeight: 600 }}>Meter Type</label>
        <select
          value={metertype}
          onChange={(e) => setMetertype(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            marginTop: 4,
            border: "1px solid #000",
          }}
        >
          {METER_TYPES.map((m) => (
            <option key={m.code} value={m.code}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ color: "#ff8a00", fontWeight: 600 }}>
          Meter Number
        </label>
        <input
          type="text"
          value={meterno}
          onChange={(e) => setMeterno(e.target.value)}
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

      <div style={{ marginBottom: 12 }}>
        <label style={{ color: "#ff8a00", fontWeight: 600 }}>Amount (₦)</label>
        <input
          type="number"
          min={1000}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
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

      {customerName && (
        <div style={{ marginBottom: 12, fontWeight: 600, color: "#027a36" }}>
          Verified Customer:{" "}
          <span style={{ color: "#ff6b00" }}>{customerName}</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button
          onClick={handleVerify}
          disabled={loading}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            background: "#027a36",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "Verifying..." : "Verify Meter"}
        </button>
        <button
          onClick={handlePay}
          disabled={loading}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            background: "#ff8a00",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "Processing..." : "Pay Electricity"}
        </button>
      </div>

      {/* Token Section */}
      {token && (
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
          <span style={{ color: "#ff6b00", fontWeight: 700 }}>
            Meter Token:
          </span>{" "}
          {token}
          <button
            onClick={handleDownloadToken}
            style={{
              marginLeft: 12,
              padding: "6px 12px",
              borderRadius: 6,
              background: "#ff8a00",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Download
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && message && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              minWidth: 300,
              maxWidth: 400,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              style={{
                fontWeight: 600,
                color: message.type === "error" ? "#b00000" : "#027a36",
                marginBottom: 16,
              }}
            >
              {message.text}
            </p>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                background: "#ff8a00",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
