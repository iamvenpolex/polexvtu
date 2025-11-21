"use client";

import { useEffect, useState, useCallback } from "react";

interface Transaction {
  id: number;
  user_id: number;
  reference: string;
  type: string;
  amount: number;
  api_amount?: number;
  network?: string;
  plan?: string;
  phone?: string;
  via?: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  balance_before?: number;
  balance_after?: number;
  message_id?: string;
  api_response?: ApiResponse;
  first_name: string;
  last_name: string;
  email: string;
}

interface ApiResponse {
  status?: string;
  message?: string;
  transactionID?: string;
  [key: string]: unknown; // allows extra fields if the API sends more
}

const ITEMS_PER_PAGE = 10;

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/admin/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const updateTransactionStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`${API_BASE}/api/admin/transactions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      fetchTransactions();
      setSelectedTransaction(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500 text-white";
      case "failed":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-orange-500 text-white";
      case "sent":
        return "bg-gray-500 text-white";
      case "cancelled":
        return "bg-pink-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const term = search.toLowerCase();
    const match =
      `${t.first_name} ${t.last_name}`.toLowerCase().includes(term) ||
      t.email.toLowerCase().includes(term) ||
      t.reference.toLowerCase().includes(term) ||
      (t.phone?.toLowerCase().includes(term) ?? false) ||
      (t.plan?.toLowerCase().includes(term) ?? false);
    const statusMatch = statusFilter ? t.status === statusFilter : true;
    return match && statusMatch;
  });

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const displayedTransactions = filteredTransactions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by user, email, reference, phone, or plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-1 min-w-[250px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="sent">Sent</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2 border">Reference</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.map((t) => (
              <tr
                key={t.id}
                className="bg-white text-gray-900 hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedTransaction(t)}
              >
                <td className="p-2 border">{t.reference}</td>
                <td className="p-2 border">
                  {t.first_name} {t.last_name}
                </td>
                <td className="p-2 border">{t.email}</td>
                <td className="p-2 border">{t.type}</td>
                <td className="p-2 border">₦{Number(t.amount).toFixed(2)}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded ${getStatusColor(t.status)}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-2 border">
                  {new Date(t.created_at).toLocaleString()}
                </td>
                <td className="p-2 border">
                  {t.status === "pending" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTransactionStatus(t.id, "success");
                        }}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-1"
                      >
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTransactionStatus(t.id, "failed");
                        }}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${
              p === page ? "bg-gray-800 text-white" : "bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-3xl relative">
            <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
            <button
              onClick={() => setSelectedTransaction(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
            >
              &times;
            </button>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(selectedTransaction).map(([key, value]) => (
                <div key={key} className="border p-2 rounded bg-gray-50">
                  <span className="font-semibold">
                    {key.replace(/_/g, " ")}:
                  </span>{" "}
                  <span>
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : value}
                  </span>
                </div>
              ))}
            </div>

            {/* Approve/Reject in modal */}
            {selectedTransaction.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    updateTransactionStatus(selectedTransaction.id, "success")
                  }
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    updateTransactionStatus(selectedTransaction.id, "failed")
                  }
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
