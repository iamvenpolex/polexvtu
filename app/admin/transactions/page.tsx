"use client";

import { useEffect, useState } from "react";

interface Transaction {
  id: number;
  reference: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
}

const ITEMS_PER_PAGE = 5;

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch("http://localhost:5000/api/admin/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const updateTransactionStatus = async (id: number, status: string) => {
    await fetch(`http://localhost:5000/api/admin/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchTransactions();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500 text-white";
      case "failed":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Filter & pagination
  const filteredTransactions = transactions.filter(
    (t) =>
      (`${t.first_name} ${t.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()) ||
        t.reference.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter ? t.status === statusFilter : true)
  );

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const displayedTransactions = filteredTransactions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search by user, email, or reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-1"
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
        </select>
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-2 border">Reference</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Created At</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedTransactions.map((t) => (
            <tr key={t.id} className="bg-white text-gray-900 hover:bg-gray-100">
              <td className="p-2 border">{t.reference}</td>
              <td className="p-2 border">
                {t.first_name} {t.last_name}
              </td>
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
              <td className="p-2 border space-x-2">
                {t.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateTransactionStatus(t.id, "success")}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateTransactionStatus(t.id, "failed")}
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

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
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
    </div>
  );
}
