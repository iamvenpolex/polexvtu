"use client";

import { useEffect, useState, useCallback } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface UserIncome {
  name: string;
  total: number;
}

interface IncomeData {
  labels: string[];
  totals: number[];
}

export default function AdminAnalyticsPage() {
  const [topUsers, setTopUsers] = useState<UserIncome[]>([]);
  const [incomeData, setIncomeData] = useState<IncomeData>({
    labels: [],
    totals: [],
  });
  const [range, setRange] = useState<"day" | "week" | "month">("day");
  const [isClient, setIsClient] = useState(false);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const fetchTopUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/admin/top-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      setTopUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, [API_BASE]);

  const fetchIncome = useCallback(
    async (range: "day" | "week" | "month") => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/admin/income?range=${range}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        setIncomeData(data);
      } catch (err) {
        console.error(err);
      }
    },
    [API_BASE]
  );

  useEffect(() => {
    setIsClient(true);
    fetchTopUsers();
    fetchIncome(range);
  }, [fetchTopUsers, fetchIncome, range]);

  const handleExportPDF = () => {
    if (!isClient) return;

    const doc = new jsPDF();
    doc.text("Top Users Report", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["Name", "Total Income"]],
      body: topUsers.map((u) => [u.name, u.total]),
    });

    doc.addPage();
    doc.text("Income Chart Report", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["Date", "Total Income"]],
      body: incomeData.labels.map((label, i) => [label, incomeData.totals[i]]),
    });

    doc.save("analytics-report.pdf");
  };

  const barData = {
    labels: incomeData.labels,
    datasets: [
      {
        label: "Income",
        data: incomeData.totals,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  const lineData = {
    labels: incomeData.labels,
    datasets: [
      {
        label: "Income",
        data: incomeData.totals,
        borderColor: "rgba(59, 130, 246, 0.8)",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      <div className="flex items-center gap-4 mb-4">
        <label>Range:</label>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as "day" | "week" | "month")}
          className="border p-2 rounded"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>

        {isClient && (
          <>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Export PDF
            </button>

            <CSVLink
              data={topUsers}
              headers={[
                { label: "Name", key: "name" },
                { label: "Total Income", key: "total" },
              ]}
              filename="top-users.csv"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Export CSV
            </CSVLink>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Users Table */}
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Top Users</h2>
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Total Income</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u, i) => (
                <tr key={i} className="bg-white hover:bg-gray-100">
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Income Chart */}
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Income Chart ({range})</h2>
          <Bar data={barData} />
          <div className="mt-4">
            <Line data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
}
