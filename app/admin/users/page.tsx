"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  Trash2,
  RefreshCcw,
  RefreshCcw as RestoreIcon,
} from "lucide-react";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  balance: number;
  reward: number;
  created_at: string;
  deleted?: boolean; // soft delete flag
}

const ITEMS_PER_PAGE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sortField, setSortField] = useState<keyof User>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`${API_BASE}/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      setSelectedUser(null);
      setEditForm({});
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRestore = async () => {
    if (!selectedUser) return;

    const confirmAction = window.confirm(
      selectedUser.deleted
        ? "Are you sure you want to restore this user?"
        : "Are you sure you want to delete this user?"
    );
    if (!confirmAction) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      if (selectedUser.deleted) {
        await fetch(`${API_BASE}/api/admin/users/${selectedUser.id}/restore`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await fetch(`${API_BASE}/api/admin/users/${selectedUser.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setSelectedUser(null);
      setEditForm({});
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${u.first_name} ${u.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const displayedUsers = sortedUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* Search & Sort */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/3 p-2 border border-gray-400 rounded mb-2 md:mb-0"
        />
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as keyof User)}
          className="p-2 border rounded"
        >
          <option value="created_at">Date</option>
          <option value="balance">Balance</option>
          <option value="first_name">Name</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="p-2 border rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Users Table */}
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
            <tr
              key={u.id}
              className={`${
                u.deleted ? "bg-red-50 text-red-600" : "bg-white text-gray-900"
              } hover:bg-gray-100`}
            >
              <td
                className="p-2 border cursor-pointer text-blue-600 underline"
                onClick={() => {
                  setSelectedUser(u);
                  setEditForm(u);
                }}
              >
                {u.first_name} {u.last_name}
              </td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.phone}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">₦{Number(u.balance).toFixed(2)}</td>
              <td className="p-2 border">₦{Number(u.reward).toFixed(2)}</td>
              <td className="p-2 border">
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setEditForm(u);
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Save size={16} /> Edit
                </button>
              </td>
            </tr>
          ))}
          {displayedUsers.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-4 text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          <ArrowLeft size={16} /> Prev
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
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next <ArrowRight size={16} />
        </button>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="First Name"
                value={editForm.first_name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, first_name: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={editForm.last_name || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, last_name: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Phone"
                value={editForm.phone || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Balance"
                value={editForm.balance || 0}
                onChange={(e) =>
                  setEditForm({ ...editForm, balance: Number(e.target.value) })
                }
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Reward"
                value={editForm.reward || 0}
                onChange={(e) =>
                  setEditForm({ ...editForm, reward: Number(e.target.value) })
                }
                className="p-2 border rounded"
              />
              <select
                value={editForm.role || "user"}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
                className="p-2 border rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
                <button
                  onClick={handleDeleteRestore}
                  className={`flex-1 px-4 py-2 rounded text-white flex items-center justify-center gap-2 ${
                    selectedUser.deleted
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {selectedUser.deleted ? (
                    <>
                      <RestoreIcon size={16} /> Restore
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 text-white text-lg font-bold">
          Loading...
        </div>
      )}
    </div>
  );
}
