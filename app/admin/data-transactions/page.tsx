"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

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
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{
        transactions: Transaction[];
        userTotals: UserTotals[];
        dashboard: DashboardStats;
      }>(`${BASE_URL}/api/buydata/admin`, {
        params: { status: statusFilter },
      });
      setTransactions(res.data.transactions);
      setUserTotals(res.data.userTotals);
      setDashboard(res.data.dashboard);
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
  }, [statusFilter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">
        Admin VTU Transactions
      </h1>

      {/* Dashboard */}
      <div className="mb-4 flex gap-4">
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

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading transactions…</p>
      ) : (
        <table className="w-full border-collapse mb-6">
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
      )}

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
    </div>
  );
}
