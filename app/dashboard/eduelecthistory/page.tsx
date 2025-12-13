"use client";

import useSWR from "swr";
import { useState } from "react";
import { ArrowLeft, History } from "lucide-react";

import Link from "next/link";

const fetcher = (url: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`).then((res) =>
    res.json()
  );

interface Token {
  id: number;
  provider: string;
  transaction_type: "electricity" | "education";
  token_value: string;
  reference: string | null;
  amount: number;
  status: string;
  created_at: string;
}

export default function HistoryPage() {
  const userId = 1; // Replace with actual user ID from auth context
  const [filter, setFilter] = useState<"all" | "electricity" | "education">(
    "all"
  );

  const { data: electricityData, error: electricityError } = useSWR(
    `/api/electricity/history/${userId}`,
    fetcher
  );
  const { data: educationData, error: educationError } = useSWR(
    `/api/education/history/${userId}`,
    fetcher
  );

  if (electricityError || educationError)
    return <div className="text-red-500 p-4">Failed to load history</div>;
  if (!electricityData || !educationData)
    return <div className="p-4">Loading...</div>;

  const allData: Token[] = [
    ...(electricityData.data ?? []),
    ...(educationData.data ?? []),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const filteredData =
    filter === "all"
      ? allData
      : allData.filter((t) => t.transaction_type === filter);

  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm mb-4 flex items-center gap-4 px-1 py-3">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
        >
          <ArrowLeft size={18} />
        </Link>

        {/* Title */}
        <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <History size={18} className="text-orange-600" />
          Transaction History
        </h1>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          className={`flex-1 px-4 py-2 rounded font-semibold ${
            filter === "all"
              ? "bg-orange-500 text-black"
              : "bg-white border border-gray-300"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded font-semibold ${
            filter === "electricity"
              ? "bg-orange-500 text-black"
              : "bg-white border border-gray-300"
          }`}
          onClick={() => setFilter("electricity")}
        >
          Electricity
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded font-semibold ${
            filter === "education"
              ? "bg-orange-500 text-black"
              : "bg-white border border-gray-300"
          }`}
          onClick={() => setFilter("education")}
        >
          Education
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center text-gray-500 p-6 bg-white rounded-lg shadow-md">
            No history yet
          </div>
        ) : (
          filteredData.map((t) => (
            <div
              key={t.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-black">{t.provider}</span>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    t.transaction_type === "electricity"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-orange-200 text-orange-900"
                  }`}
                >
                  {t.transaction_type.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-1">
                Token / PIN: <span className="font-mono">{t.token_value}</span>
              </div>
              <div className="text-sm text-gray-700 mb-1">
                Amount:{" "}
                <span className="font-semibold">
                  ₦{t.amount.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-1">
                Status: <span className="capitalize">{t.status}</span>
              </div>
              <div className="text-xs text-gray-500">
                Date: {new Date(t.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
