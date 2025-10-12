"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Transaction {
  id: number;
  reference: string;
  user_id: number;
  type: string;
  amount: number;
  status: "pending" | "success" | "failed";
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserTotals {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  totalSpent: number;
  totalTransactions: number;
}

interface DashboardStats {
  totalRevenue: number;
  totalPending: number;
  totalFailed: number;
}

export default function AdminVTUTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userTotals, setUserTotals] = useState<UserTotals[]>([]);
  const [dashboard, setDashboard] = useState<DashboardStats>({
    totalRevenue: 0,
    totalPending: 0,
    totalFailed: 0,
  });

  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{
        transactions: Transaction[];
        userTotals: UserTotals[];
        dashboard: DashboardStats;
        totalPages: number;
      }>(`${BASE_URL}/api/buydata/admin`, {
        params: {
          status: statusFilter,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          page,
          limit: 10,
        },
      });
      setTransactions(res.data.transactions);
      setUserTotals(res.data.userTotals);
      setDashboard(res.data.dashboard);
      setTotalPages(res.data.totalPages);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "fetchTransactions AxiosError:",
          err.response?.data || err.message
        );
      } else if (err instanceof Error) {
        console.error("fetchTransactions Error:", err.message);
      } else {
        console.error("fetchTransactions Unknown error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, startDate, endDate, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">
        Admin VTU Transactions
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div>
          <label>Status:</label>
          <select
            className="border px-2 py-1 rounded ml-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            className="border px-2 py-1 rounded ml-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            className="border px-2 py-1 rounded ml-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
          onClick={() => setPage(1)}
        >
          Apply Filters
        </button>
      </div>

      {/* Dashboard */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <div className="bg-green-100 px-4 py-2 rounded">
          <strong>Total Revenue:</strong> ₦{dashboard.totalRevenue}
        </div>
        <div className="bg-yellow-100 px-4 py-2 rounded">
          <strong>Pending:</strong> ₦{dashboard.totalPending}
        </div>
        <div className="bg-red-100 px-4 py-2 rounded">
          <strong>Failed:</strong> ₦{dashboard.totalFailed}
        </div>
      </div>

      {loading ? (
        <p>Loading transactions…</p>
      ) : (
        <>
          {/* Transactions Table */}
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-orange-100">
                <th className="border px-3 py-1">Reference</th>
                <th className="border px-3 py-1">User</th>
                <th className="border px-3 py-1">Email</th>
                <th className="border px-3 py-1">Amount</th>
                <th className="border px-3 py-1">Status</th>
                <th className="border px-3 py-1">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-orange-50">
                  <td className="border px-3 py-1">{tx.reference}</td>
                  <td className="border px-3 py-1">
                    {tx.first_name} {tx.last_name}
                  </td>
                  <td className="border px-3 py-1">{tx.email}</td>
                  <td className="border px-3 py-1">₦{tx.amount}</td>
                  <td
                    className={`border px-3 py-1 font-semibold ${
                      tx.status === "success"
                        ? "text-green-600"
                        : tx.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.status.toUpperCase()}
                  </td>
                  <td className="border px-3 py-1">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex gap-2 mb-6">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>

          {/* Per-user totals */}
          <h2 className="text-xl font-bold mb-2">Per User Totals</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-orange-100">
                <th className="border px-3 py-1">User</th>
                <th className="border px-3 py-1">Email</th>
                <th className="border px-3 py-1">Total Spent</th>
                <th className="border px-3 py-1">Total Transactions</th>
              </tr>
            </thead>
            <tbody>
              {userTotals.map((u) => (
                <tr key={u.user_id} className="hover:bg-orange-50">
                  <td className="border px-3 py-1">
                    {u.first_name} {u.last_name}
                  </td>
                  <td className="border px-3 py-1">{u.email}</td>
                  <td className="border px-3 py-1">₦{u.totalSpent}</td>
                  <td className="border px-3 py-1">{u.totalTransactions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
