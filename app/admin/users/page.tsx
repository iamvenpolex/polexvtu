"use client";

import { useEffect, useState, useCallback } from "react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  balance: number;
  reward: number;
}

const ITEMS_PER_PAGE = 5;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [userEdits, setUserEdits] = useState<
    Record<number, { balance: number; reward: number; role: string }>
  >({});
  const [page, setPage] = useState(1);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      if (!Array.isArray(data)) return;

      setUsers(data);

      const edits: Record<
        number,
        { balance: number; reward: number; role: string }
      > = {};
      data.forEach((u: User) => {
        edits[u.id] = {
          balance: Number(u.balance) || 0,
          reward: Number(u.reward) || 0,
          role: u.role || "user",
        };
      });
      setUserEdits(edits);
    } catch (err) {
      console.error(err);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = async (id: number) => {
    try {
      const edit = userEdits[id];
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(edit),
      });

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const displayedUsers = users.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Balance</th>
            <th className="p-2 border">Reward</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((u) => (
            <tr key={u.id} className="bg-white text-gray-900 hover:bg-gray-100">
              <td className="p-2 border">
                {u.first_name} {u.last_name}
              </td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.phone}</td>
              <td className="p-2 border">
                <select
                  value={userEdits[u.id]?.role ?? "user"}
                  onChange={(e) =>
                    setUserEdits({
                      ...userEdits,
                      [u.id]: { ...userEdits[u.id], role: e.target.value },
                    })
                  }
                  className="p-1 border rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={userEdits[u.id]?.balance ?? 0}
                  onChange={(e) =>
                    setUserEdits({
                      ...userEdits,
                      [u.id]: {
                        ...userEdits[u.id],
                        balance: Number(e.target.value),
                      },
                    })
                  }
                  className="w-20 p-1 border rounded"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={userEdits[u.id]?.reward ?? 0}
                  onChange={(e) =>
                    setUserEdits({
                      ...userEdits,
                      [u.id]: {
                        ...userEdits[u.id],
                        reward: Number(e.target.value),
                      },
                    })
                  }
                  className="w-20 p-1 border rounded"
                />
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => updateUser(u.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
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
