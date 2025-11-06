"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, CreditCard, User2, X } from "lucide-react";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!email || email.includes("@")) {
      setSuggestions([]);
      return;
    }
    const domains = ["gmail.com", "yahoo.com", "outlook.com"];
    setSuggestions(domains.map((d) => `${email}@${d}`));
  }, [email]);

  const handleSuggestionClick = (suggestion: string) => {
    setEmail(suggestion);
    setSuggestions([]);
  };

  const confirmTransfer = () => {
    setShowModal(false);
    handleSubmit();
  };

  return (
    <>
      {/* Main Transfer Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-md px-5 py-6 max-w-sm mx-auto"
      >
        {/* Wallet Balance */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">Available Balance</p>
          <h2 className="text-3xl font-bold text-gray-900">
            ₦{walletBalance.toLocaleString()}
          </h2>
        </div>

        {/* Email Input */}
        <div className="relative mb-4">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-1">
            <Mail size={14} /> Recipient Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient email"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border text-black border-gray-200 rounded-lg w-full mt-1 shadow-md max-h-40 overflow-y-auto">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="p-2 text-sm hover:bg-orange-50 cursor-pointer"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recipient Info */}
        {recipientName ? (
          <div className="flex items-center gap-2 mb-3 text-green-600 text-sm font-medium">
            <User2 size={16} />
            Recipient: {recipientName}
          </div>
        ) : (
          email &&
          suggestions.length === 0 && (
            <p className="text-red-500 text-xs mb-3">Recipient not found</p>
          )
        )}

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-1">
            <CreditCard size={14} /> Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              const val = Number(e.target.value);
              setAmount(val > walletBalance ? walletBalance : val);
            }}
            placeholder={`Enter amount (max ₦${walletBalance.toLocaleString()})`}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800"
          />
        </div>

        {/* Send Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          disabled={
            loading ||
            Number(amount) <= 0 ||
            Number(amount) > walletBalance ||
            !recipientName
          }
          className={`w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-all ${
            loading || !recipientName
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              <Send size={18} /> Send Funds
            </>
          )}
        </motion.button>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
        )}
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Confirm Transfer
                </h3>
                <button onClick={() => setShowModal(false)}>
                  <X className="text-gray-500 hover:text-gray-700" size={20} />
                </button>
              </div>

              <div className="text-gray-700 text-sm mb-5 space-y-1">
                <p>
                  Recipient:{" "}
                  <span className="font-semibold">{recipientName}</span>
                </p>
                <p>
                  Email: <span className="font-semibold">{email}</span>
                </p>
                <p>
                  Amount:{" "}
                  <span className="font-semibold text-orange-600">
                    ₦{Number(amount).toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2 border rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmTransfer}
                  className="w-1/2 py-2 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
