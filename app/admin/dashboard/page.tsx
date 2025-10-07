"use client";

import { useEffect, useState, useCallback } from "react";

interface User {
  balance: number | string;
}

interface Transaction {
  status: string;
  amount: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isClient, setIsClient] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return setUsers([]);

      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  }, [API_BASE]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return setTransactions([]);

      const res = await fetch(`${API_BASE}/api/admin/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
    }
  }, [API_BASE]);

  useEffect(() => {
    setIsClient(true);
    fetchUsers();
    fetchTransactions();
  }, [fetchUsers, fetchTransactions]);

  // Safe calculations
  const totalBalance = users.reduce(
    (acc, u) => acc + (Number(u.balance) || 0),
    0
  );
  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending"
  ).length;

  if (!isClient) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white shadow rounded text-center">
        <h2 className="text-lg font-semibold">Total Users</h2>
        <p className="text-2xl font-bold">{users.length}</p>
      </div>

      <div className="p-6 bg-white shadow rounded text-center">
        <h2 className="text-lg font-semibold">Total Balance</h2>
        <p className="text-2xl font-bold">₦{totalBalance.toFixed(2)}</p>
      </div>

      <div className="p-6 bg-white shadow rounded text-center">
        <h2 className="text-lg font-semibold">Pending Transactions</h2>
        <p className="text-2xl font-bold">{pendingTransactions}</p>
      </div>
    </div>
  );
}
