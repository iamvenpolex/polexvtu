"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const SMSAdminPage = () => {
  const [price, setPrice] = useState(0);
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // Load token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  // Fetch current SMS price
  useEffect(() => {
    if (!token) return;

    const fetchPrice = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sms/current-price`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPrice(res.data.price);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrice();
  }, [token]);

  const handleSetPrice = async () => {
    if (!newPrice || !token) {
      alert("Please enter a valid price");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sms/set-price`,
        { price: Number(newPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrice(res.data.price);
      setMessage(res.data.message);
      setNewPrice("");
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to set price");
      } else {
        alert("An unexpected error occurred");
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-orange-600">
      <h1 className="text-2xl font-bold mb-4">Admin: Set SMS Price</h1>

      <p className="mb-4">
        Current SMS Price: <strong>N{price}</strong> per SMS
      </p>

      <div className="mb-4">
        <label className="block mb-1">New SMS Price (Naira)</label>
        <input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="w-full p-2 border border-orange-400 rounded bg-orange-50 text-orange-600"
        />
      </div>

      <button
        onClick={handleSetPrice}
        disabled={loading || !token}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        {loading ? "Updating..." : "Set Price"}
      </button>

      {message && (
        <div className="mt-4 p-3 rounded bg-orange-100 text-orange-800">
          {message}
        </div>
      )}
    </div>
  );
};

export default SMSAdminPage;
