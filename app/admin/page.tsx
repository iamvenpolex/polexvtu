"use client";

import { useEffect, useState } from "react";

interface User {
  balance: number | string; // could come as string from API
}

interface Transaction {
  status: string;
  amount: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // ensure we only render numeric calculations on client
    fetchUsers();
    fetchTransactions();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  // Ensure we parse balances as numbers
  const totalBalance = users.reduce(
    (acc, u) => acc + (Number(u.balance) || 0),
    0
  );

  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending"
  ).length;

  if (!isClient) return null; // avoid hydration mismatch

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
