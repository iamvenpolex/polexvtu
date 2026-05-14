"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mail,
  CreditCard,
  User2,
  X,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

interface Beneficiary {
  email: string;
  name: string;
}

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
  isSearching: boolean;
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
  isSearching,
}: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  // ✅ Beneficiaries
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

  // ✅ Charges
  const numericAmount = Number(amount) || 0;
  const transferCharge = numericAmount > 1000 ? 10 : 0;
  const totalAmount = numericAmount + transferCharge;

  // ✅ Load beneficiaries
  useEffect(() => {
    const saved = localStorage.getItem("tapamBeneficiaries");

    if (saved) {
      setBeneficiaries(JSON.parse(saved));
    }
  }, []);

  // ✅ Save beneficiaries
  useEffect(() => {
    if (!recipientName || !email.includes("@")) return;

    const exists = beneficiaries.some((b) => b.email === email);

    if (!exists) {
      const updated = [
        {
          email,
          name: recipientName,
        },
        ...beneficiaries,
      ].slice(0, 6);

      setBeneficiaries(updated);

      localStorage.setItem("tapamBeneficiaries", JSON.stringify(updated));
    }
  }, [recipientName]);

  // ✅ Email suggestions
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

  // ✅ Validation
  const isBelowMinimum = numericAmount < 50;
  const insufficientBalance = totalAmount > walletBalance;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-lg px-5 py-6 max-w-sm mx-auto"
      >
        {/* Wallet Balance */}
        <div className="text-center mb-7">
          <p className="text-gray-500 text-sm">Available Balance</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            ₦{walletBalance.toLocaleString()}
          </h2>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= item
                        ? "bg-orange-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {item}
                  </div>

                  <span className="text-xs mt-1 text-gray-600">
                    {item === 1
                      ? "Recipient"
                      : item === 2
                        ? "Amount"
                        : "Confirm"}
                  </span>
                </div>

                {item !== 3 && (
                  <div className="w-10 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        step > item ? "bg-orange-600" : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Beneficiaries */}
            {beneficiaries.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-orange-600" />

                  <p className="text-sm font-semibold text-gray-700">
                    Recent Beneficiaries
                  </p>
                </div>

                <div className="space-y-2">
                  {beneficiaries.map((b, index) => (
                    <button
                      key={index}
                      onClick={() => setEmail(b.email)}
                      className="w-full border border-gray-200 rounded-xl p-3 text-left hover:border-orange-400 hover:bg-orange-50 transition"
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {b.name}
                      </p>

                      <p className="text-xs text-gray-500">{b.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
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

            {/* Search State */}
            {isSearching ? (
              <div className="flex items-center gap-2 mb-5 text-orange-600 text-sm font-medium bg-orange-50 p-3 rounded-xl border border-orange-200">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                Searching recipient...
              </div>
            ) : recipientName ? (
              <div className="flex items-center gap-2 mb-5 text-green-600 text-sm font-medium bg-green-50 p-3 rounded-xl border border-green-200">
                <CheckCircle2 size={16} />
                Recipient: {recipientName}
              </div>
            ) : (
              email.includes("@") &&
              suggestions.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 text-gray-600 text-xs p-3 rounded-xl mb-4">
                  No registered TapAm user found
                </div>
              )
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!recipientName}
              className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                recipientName
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-orange-300 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Recipient */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-5">
              <p className="text-xs text-gray-500 mb-1">Sending To</p>

              <div className="flex items-center gap-2">
                <User2 size={16} className="text-orange-600" />

                <div>
                  <p className="font-semibold text-gray-800">{recipientName}</p>

                  <p className="text-xs text-gray-500">{email}</p>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-1">
                <CreditCard size={14} /> Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 text-lg font-semibold"
              />
            </div>

            {/* Rules */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-5 text-sm text-gray-700 space-y-1">
              <p>• Minimum transfer: ₦50</p>
              <p>• ₦10 charge applies above ₦1,000</p>

              {transferCharge > 0 && (
                <>
                  <div className="border-t border-orange-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Transfer Amount</span>
                      <span>₦{numericAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Transfer Charge</span>
                      <span>₦10</span>
                    </div>

                    <div className="flex justify-between font-bold text-orange-600 mt-1">
                      <span>Total Deduction</span>
                      <span>₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Errors */}
            {isBelowMinimum && (
              <p className="text-red-500 text-sm mb-3">
                Minimum transfer amount is ₦50
              </p>
            )}

            {insufficientBalance && (
              <p className="text-red-500 text-sm mb-3">
                Insufficient wallet balance
              </p>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/2 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>

              <button
                onClick={() => setStep(3)}
                disabled={
                  numericAmount <= 0 || isBelowMinimum || insufficientBalance
                }
                className={`w-1/2 py-3 rounded-xl text-white font-semibold transition ${
                  !isBelowMinimum && !insufficientBalance && numericAmount > 0
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-orange-300 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-5">
              <div className="flex justify-center mb-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Clock3 className="text-orange-600" size={24} />
                </div>
              </div>

              <h3 className="text-center font-bold text-gray-800 text-lg mb-4">
                Confirm Transfer
              </h3>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Recipient</span>
                  <span className="font-semibold">{recipientName}</span>
                </div>

                <div className="flex justify-between">
                  <span>Email</span>
                  <span className="font-semibold">{email}</span>
                </div>

                <div className="flex justify-between">
                  <span>Transfer Amount</span>
                  <span className="font-semibold">
                    ₦{numericAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Charge</span>
                  <span className="font-semibold">
                    ₦{transferCharge.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-orange-200 pt-2 flex justify-between">
                  <span className="font-bold">Total Deduction</span>

                  <span className="font-bold text-orange-600 text-lg">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/2 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowModal(true)}
                disabled={loading}
                className={`w-1/2 flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl transition-all ${
                  loading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <Send size={18} />
                    Send
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Final Confirmation
                </h3>

                <button onClick={() => setShowModal(false)}>
                  <X className="text-gray-500 hover:text-gray-700" size={20} />
                </button>
              </div>

              <div className="text-sm text-gray-700 space-y-2 mb-5">
                <p>
                  You are sending{" "}
                  <span className="font-bold text-orange-600">
                    ₦{numericAmount.toLocaleString()}
                  </span>
                </p>

                {transferCharge > 0 && (
                  <p>
                    Charge: <span className="font-semibold">₦10</span>
                  </p>
                )}

                <p>
                  Total deduction:{" "}
                  <span className="font-bold">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </p>

                <p>
                  To: <span className="font-semibold">{recipientName}</span>
                </p>

                <p className="text-xs text-red-500">
                  Please verify recipient carefully before proceeding.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmTransfer}
                  className="w-1/2 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700"
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
