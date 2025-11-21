"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface GiftCard {
  id: number;
  code: string;
  amount: number | null;
  description: string | null;
  is_redeemed: boolean;
  redeemed_by: number | null;
  created_at: string;
  redeemed_at?: string | null;
  expires_at?: string | null;
}

export default function GiftCardAdminPage() {
  const [amount, setAmount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false); // loading for button
  const [token, setToken] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<
    "amount" | "status" | "expires_at" | null
  >(null);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get<GiftCard[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/giftcards/admin/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(res.data);
    } catch (error: unknown) {
      let errMsg = "Failed to fetch history";
      if (axios.isAxiosError(error)) {
        errMsg = error.response?.data?.message || errMsg;
      } else if (error instanceof Error) {
        errMsg = error.message;
      }
      console.error("Error fetching gift card history:", error);
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const generateCards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !quantity || !expiresAt)
      return setMessage("Please fill in all required fields");
    if (quantity > 5) return setMessage("Maximum 5 codes per request");

    try {
      setGenerating(true);
      const res = await axios.post<{ message: string }>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/giftcards/admin/bulk`,
        { amount, quantity, expires_at: expiresAt, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setAmount(0);
      setQuantity(1);
      setExpiresAt("");
      setDescription("");
      fetchHistory();
    } catch (error: unknown) {
      let errMsg = "Failed to generate codes";
      if (axios.isAxiosError(error)) {
        errMsg = error.response?.data?.message || errMsg;
      } else if (error instanceof Error) {
        errMsg = error.message;
      }
      console.error("Generate error:", error);
      setMessage(errMsg);
    } finally {
      setGenerating(false);
    }
  };

  const getStatus = (card: GiftCard): "Available" | "Redeemed" | "Expired" => {
    if (card.is_redeemed) return "Redeemed";
    if (card.expires_at && new Date(card.expires_at) < new Date())
      return "Expired";
    return "Available";
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  const sortedHistory = [...history].sort((a, b) => {
    if (!sortKey) return 0;
    let valA: number;
    let valB: number;

    if (sortKey === "amount") {
      valA = a.amount ?? 0;
      valB = b.amount ?? 0;
    } else if (sortKey === "status") {
      const statusOrder: Record<ReturnType<typeof getStatus>, number> = {
        Available: 0,
        Redeemed: 1,
        Expired: 2,
      };
      valA = statusOrder[getStatus(a)];
      valB = statusOrder[getStatus(b)];
    } else if (sortKey === "expires_at") {
      valA = a.expires_at ? new Date(a.expires_at).getTime() : 0;
      valB = b.expires_at ? new Date(b.expires_at).getTime() : 0;
    } else {
      valA = 0;
      valB = 0;
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (key: "amount" | "status" | "expires_at") => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const getStatusColor = (status: "Available" | "Redeemed" | "Expired") => {
    if (status === "Available") return "text-green-600 font-semibold";
    if (status === "Redeemed") return "text-blue-600 font-semibold";
    if (status === "Expired") return "text-red-600 font-semibold";
    return "";
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setMessage(`Code "${code}" copied to clipboard!`);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setMessage("Failed to copy code");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gift Card Admin</h1>

      <form
        onSubmit={generateCards}
        className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-2 items-end"
      >
        <div>
          <label className="block font-semibold">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
            placeholder="₦ Amount"
          />
        </div>
        <div>
          <label className="block font-semibold">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
            placeholder="Max 5"
            max={5}
          />
        </div>
        <div>
          <label className="block font-semibold">Expiry Date</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Optional"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={generating}
            className={`w-full px-4 py-2 rounded text-white ${
              generating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {generating ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <h2 className="text-xl font-semibold mb-2">Gift Card History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">Code</th>
                <th
                  className="px-3 py-2 border cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Amount {sortKey === "amount" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th className="px-3 py-2 border">Description</th>
                <th
                  className="px-3 py-2 border cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status {sortKey === "status" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th className="px-3 py-2 border">Redeemed By</th>
                <th className="px-3 py-2 border">Generated At</th>
                <th className="px-3 py-2 border">Redeemed At</th>
                <th
                  className="px-3 py-2 border cursor-pointer"
                  onClick={() => handleSort("expires_at")}
                >
                  Expires At{" "}
                  {sortKey === "expires_at" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-2 text-center">
                    No gift cards found
                  </td>
                </tr>
              ) : (
                sortedHistory.map((h) => {
                  const status = getStatus(h);
                  return (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border flex items-center gap-2">
                        {h.code}
                        <button
                          onClick={() => copyCode(h.code)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Copy
                        </button>
                      </td>
                      <td className="px-3 py-2 border">₦{h.amount ?? 0}</td>
                      <td className="px-3 py-2 border">
                        {h.description ?? "-"}
                      </td>
                      <td
                        className={`px-3 py-2 border ${getStatusColor(status)}`}
                      >
                        {status}
                      </td>
                      <td className="px-3 py-2 border">
                        {h.redeemed_by ?? "-"}
                      </td>
                      <td className="px-3 py-2 border">
                        {formatDate(h.created_at)}
                      </td>
                      <td className="px-3 py-2 border">
                        {formatDate(h.redeemed_at)}
                      </td>
                      <td className="px-3 py-2 border">
                        {formatDate(h.expires_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
