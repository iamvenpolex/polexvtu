"use client";

import { useState, useEffect } from "react";

interface Props {
  amount: number | string;
  setAmount: (val: number | string) => void;
  email: string;
  setEmail: (val: string) => void;
  recipientName: string;
  handleSubmit: () => void;
  loading: boolean;
  message: string;
  walletBalance?: number;
}

export default function WalletToTapamForm({
  amount,
  setAmount,
  email,
  setEmail,
  recipientName,
  handleSubmit,
  loading,
  message,
  walletBalance = 0,
}: Props) {
  const inputClasses =
    "w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900";

  const [suggestions, setSuggestions] = useState<string[]>([]);

  // ✅ Auto-suggest email domains
  useEffect(() => {
    if (!email || email.includes("@")) {
      setSuggestions([]);
      return;
    }

    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
    ];
    const newSuggestions = commonDomains.map((domain) => `${email}@${domain}`);
    setSuggestions(newSuggestions);
  }, [email]);

  const handleSuggestionClick = (suggestion: string) => {
    setEmail(suggestion);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      setEmail(suggestions[0]);
      setSuggestions([]);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto mb-6">
      <p className="text-gray-600 text-sm mb-2">
        Wallet Balance: ₦{walletBalance.toLocaleString()}
      </p>

      {/* ✅ Email Input + Suggestions */}
      <div className="relative mb-2">
        <input
          type="email"
          placeholder="Recipient Email"
          className={inputClasses}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded w-full mt-1 shadow max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-orange-100 text-black cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {recipientName && (
        <p className="text-green-600 text-sm mb-2">
          Recipient: {recipientName}
        </p>
      )}

      {!recipientName && email && suggestions.length === 0 && (
        <p className="text-red-600 text-sm mb-2">Recipient not found</p>
      )}

      <input
        type="number"
        placeholder={`Enter amount (max ₦${walletBalance.toLocaleString()})`}
        className={inputClasses + " mb-2"}
        value={amount}
        onChange={(e) => {
          const val = Number(e.target.value);
          setAmount(val > walletBalance ? walletBalance : val);
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={
          loading ||
          Number(amount) <= 0 ||
          Number(amount) > walletBalance ||
          !recipientName
        }
        className="w-full py-3 mt-4 bg-orange-600 text-white rounded font-semibold hover:bg-orange-700 "
      >
        {loading ? "Processing..." : "Send Funds"}
      </button>

      {message && (
        <p className="text-center text-sm mt-2 text-gray-700">{message}</p>
      )}
    </div>
  );
}
