"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios, { AxiosError } from "axios";
import WalletToTapamForm from "./WalletToTapamForm/page";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function WalletTapamPage() {
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
  }, []);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }),
    [token]
  );

  // Fetch user wallet balance
  const fetchBalance = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/wallet/balance", {
        headers,
      });
      setWalletBalance(res.data.balance);
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      console.error(err.response?.data?.error || err.message);
    }
  }, [headers, token]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Lookup recipient name by email
  const lookupRecipient = useCallback(async () => {
    if (!email) return setRecipientName("");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/withdraw/tapam/lookup?email=${email}`,
        { headers }
      );
      setRecipientName(res.data.name || "");
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      console.error(err.response?.data?.error || err.message);
      setRecipientName(""); // reset if not found
    }
  }, [email, headers]);

  // Trigger lookup whenever email changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      lookupRecipient();
    }, 500); // debounce 500ms

    return () => clearTimeout(delayDebounce);
  }, [email, lookupRecipient]);

  // Handle send funds
  const handleWalletToTapam = async () => {
    if (amount <= 0 || !email || !recipientName) {
      return setMessage("Enter valid details");
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/withdraw/wallet-to-tapam",
        { amount, email, recipientName },
        { headers }
      );
      setMessage(res.data.message);
      setAmount(0);
      setEmail("");
      setRecipientName("");
      fetchBalance();
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      setMessage(err.response?.data?.error || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Sticky Back to Dashboard */}
      <div className="bg-gray-50 border-b px-4 py-2 sticky top-16 z-40 rounded-t-xl">
        <Link
          href="/dashboard/wallet/withdraw"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-sm sm:text-base"
        >
          <LayoutDashboard size={18} />
          Back to Withdraw
        </Link>
      </div>

      <WalletToTapamForm
        amount={amount}
        setAmount={setAmount}
        email={email}
        setEmail={setEmail}
        recipientName={recipientName}
        handleSubmit={handleWalletToTapam}
        loading={loading}
        message={message}
        walletBalance={walletBalance}
      />
    </div>
  );
}
