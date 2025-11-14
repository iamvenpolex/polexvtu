"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const SMSPage = () => {
  const [price, setPrice] = useState(0);
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  // Only access localStorage in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchPrice = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sms/current-price`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPrice(res.data.price);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(err.response?.data || err.message);
        } else {
          console.error(err);
        }
      }
    };
    fetchPrice();
  }, [token]);

  const handleSendSMS = async () => {
    if (!recipients || !message || !sender || !token) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/sms/send`,
        { recipients, message, sender },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to send SMS");
      } else {
        alert("Failed to send SMS");
      }
      console.error(err);
    }
    setLoading(false);
  };

  const totalCost = recipients ? recipients.split(",").length * price : 0;

  return (
    <div className="max-w-xl mx-auto p-6 text-orange-600">
      <h1 className="text-2xl font-bold mb-4 text-orange-700">Send SMS</h1>

      <div className="mb-4">
        <label className="block mb-1">Sender Name</label>
        <input
          type="text"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          className="w-full p-2 border rounded border-orange-400 text-orange-800"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Recipients (comma-separated)</label>
        <input
          type="text"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          className="w-full p-2 border rounded border-orange-400 text-orange-800"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded border-orange-400 text-orange-800"
          rows={4}
        />
      </div>

      <div className="mb-4">
        <p>
          Current SMS Price: <strong>N{price}</strong> per SMS
        </p>
        <p>
          Total Cost: <strong>N{totalCost}</strong>
        </p>
      </div>

      <button
        onClick={handleSendSMS}
        disabled={loading || !token}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        {loading ? "Sending..." : "Send SMS"}
      </button>

      {result && (
        <div className="mt-4 p-4 border rounded bg-orange-100 text-orange-900">
          <h2 className="font-semibold mb-2">Result:</h2>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SMSPage;
