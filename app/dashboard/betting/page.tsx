"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  CreditCard,
  X,
  CheckCircle,
  XCircle,
  Copy,
} from "lucide-react";
import Link from "next/link";

type ApiResponse = {
  success?: boolean;
  status?: string;
  orderid?: string;
  statuscode?: string;
  remark?: string;
  message?: string;
  orderId?: string;
  customer_name?: string;
  amountcharged?: number;
  walletbalance?: number;
  [key: string]: unknown;
};

export default function BettingPage() {
  const [bettingCompany, setBettingCompany] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isCustomerVerified, setIsCustomerVerified] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const bettingCompanies = [
    "msport",
    "naijabet",
    "nairabet",
    "bet9ja-agent",
    "betland",
    "betlion",
    "supabet",
    "bet9ja",
    "bangbet",
    "betking",
    "1xbet",
    "betway",
    "merrybet",
    "mlotto",
    "western-lotto",
    "hallabet",
    "green-lotto",
  ];

  // ---- STATUS MAPPING ----
  const statusMap: Record<string, "success" | "pending" | "failed"> = {
    "00": "success",
    "100": "failed",
    "101": "pending",
    SUCCESS: "success",
    ORDER_COMPLETED: "success",
    ORDER_RECEIVED: "pending",
    ORDER_ONHOLD: "pending",
    ORDER_CANCELLED: "failed",
    FAILED: "failed",
    ERROR: "failed",
  };

  const deriveStatus = (
    api: ApiResponse | null
  ): "success" | "pending" | "failed" | "unknown" => {
    if (!api) return "unknown";
    const code = (api.status || api.statuscode || "").toUpperCase();
    return statusMap[code] || "unknown";
  };

  const getFriendlyMessage = (api: ApiResponse | null) => {
    if (!api) return "No response from server.";
    const status = deriveStatus(api);
    if (status === "success")
      return `Customer ${api.customer_name || customerId} is valid ✅`;
    if (status === "pending")
      return `Verification for ${
        api.customer_name || customerId
      } is pending ⏳`;
    if (status === "failed")
      return `Customer ${api.customer_name || customerId} is invalid ❌`;
    return api.message || "Unknown status";
  };

  const copyToClipboard = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  // ---- HELPERS: JWT HEADER ----
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : undefined;
  };

  // ---- FUND WALLET ----
  const handleFundWallet = async () => {
    if (!bettingCompany || !customerId || !amount) {
      alert(
        "Please fill all required fields (Betting company, Customer ID, Amount)."
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to perform this action.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const callbackUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/api/betting/callback`
          : "";

      const res = await axios.post<ApiResponse>(
        `${API_BASE}/api/betting/fund-wallet`,
        {
          bettingCompany,
          customerId,
          phoneNumber: phoneNumber || undefined,
          amount: Number(amount),
          requestId: Date.now().toString(),
          callbackUrl,
        },
        getAuthConfig()
      );

      setResponse(res.data);
      if (res.data.orderId) setOrderId(res.data.orderId);
      else if (res.data.orderid) setOrderId(res.data.orderid);
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        setResponse(err.response?.data as ApiResponse);
      else setResponse({ message: "Unexpected error" });
    } finally {
      setLoading(false);
    }
  };

  // ---- QUERY TRANSACTION ----
  const handleQueryTransaction = async () => {
    if (!orderId) {
      alert("Enter Order ID to query.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to perform this action.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.get<ApiResponse>(
        `${API_BASE}/api/betting/query/${orderId}`,
        getAuthConfig()
      );
      setResponse(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        setResponse(err.response?.data as ApiResponse);
      else setResponse({ message: "Unexpected error" });
    } finally {
      setLoading(false);
    }
  };

  // ---- VERIFY CUSTOMER ----
  const handleVerifyCustomer = async () => {
    if (!bettingCompany || !customerId) {
      alert("Select betting company and enter Customer ID.");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.get<ApiResponse>(
        `${API_BASE}/api/betting/verify/${bettingCompany}/${encodeURIComponent(
          customerId
        )}`
      );

      setResponse(res.data);
      const status = deriveStatus(res.data);
      setIsCustomerVerified(status === "success");
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        setResponse(err.response?.data as ApiResponse);
      else setResponse({ message: "Unexpected error" });
      setIsCustomerVerified(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm mb-6">
        <div className="flex items-center gap-3 px-2 py-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CreditCard size={18} className="text-orange-600" />
            Betting Wallet
          </h1>
        </div>
      </header>

      {/* FUND WALLET */}
      <div className="bg-white p-5 rounded-xl shadow space-y-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Fund Wallet</h2>

        <select
          value={bettingCompany}
          onChange={(e) => setBettingCompany(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-gray-700"
        >
          <option value="">-Select Betting Company-</option>
          {bettingCompanies.map((b) => (
            <option key={b} value={b}>
              {b.toUpperCase()}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 outline-none text-gray-700 ${
            isCustomerVerified
              ? "border-green-500 focus:ring-green-400"
              : customerId && !isCustomerVerified
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-orange-400"
          }`}
        />

        <input
          type="tel"
          placeholder="Phone Number (optional)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-gray-700"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-gray-700"
          min={100}
        />

        <div className="flex gap-2">
          <button
            onClick={handleFundWallet}
            disabled={loading || !isCustomerVerified}
            className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold shadow-md transition"
          >
            {loading ? "Processing..." : "Fund Wallet"}
          </button>

          <button
            onClick={() => copyToClipboard(orderId)}
            className="flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition"
            title="Copy latest order id"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* QUERY + VERIFY BUTTONS */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleQueryTransaction}
            disabled={!orderId || loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg transition"
          >
            Query Transaction
          </button>
          <button
            onClick={handleVerifyCustomer}
            disabled={!customerId || !bettingCompany || loading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg transition"
          >
            Verify Customer
          </button>
        </div>
      </div>

      {/* RESPONSE MODAL */}
      {response && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setResponse(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              {deriveStatus(response) === "success" ? (
                <CheckCircle size={28} className="text-green-600" />
              ) : deriveStatus(response) === "pending" ? (
                <span className="inline-block w-7 h-7 rounded-full bg-yellow-400" />
              ) : (
                <XCircle size={28} className="text-red-600" />
              )}

              <h3
                className={`text-lg font-bold ${
                  deriveStatus(response) === "success"
                    ? "text-green-700"
                    : deriveStatus(response) === "pending"
                    ? "text-yellow-700"
                    : "text-red-700"
                }`}
              >
                {getFriendlyMessage(response)}
              </h3>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              {response.customer_name && (
                <div>
                  <b>Customer:</b> {response.customer_name}
                </div>
              )}
              {response.orderid && (
                <div>
                  <b>Order ID:</b> {response.orderid}
                </div>
              )}
              {response.orderId && (
                <div>
                  <b>Order ID:</b> {response.orderId}
                </div>
              )}
              {response.amountcharged && (
                <div>
                  <b>Amount Charged:</b> ₦{response.amountcharged}
                </div>
              )}
              {response.walletbalance && (
                <div>
                  <b>Wallet Balance:</b> ₦{response.walletbalance}
                </div>
              )}
              {response.remark && (
                <div>
                  <b>Remark:</b> {response.remark}
                </div>
              )}
              {response.message && (
                <div>
                  <b>Message:</b> {response.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
