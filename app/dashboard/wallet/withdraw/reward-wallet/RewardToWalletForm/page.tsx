"use client";

import React from "react";

interface Props {
  amount: string;
  setAmount: (val: string) => void;
  handleSubmit: () => void;
  loading: boolean;
  message: string;
  rewardBalance?: number;
}

export default function RewardToWalletForm({
  amount,
  setAmount,
  handleSubmit,
  loading,
  message,
  rewardBalance = 0,
}: Props) {
  const inputClasses = `
  w-full p-3 border border-gray-300 rounded-lg 
  focus:outline-none focus:ring-2 focus:ring-orange-400 
  text-gray-900 placeholder-gray-500 
  bg-white autofill:!bg-white autofill:!text-gray-900 
  dark:bg-white dark:text-gray-900
`;

  const numericAmount = parseFloat(amount) || 0;
  const isInvalid =
    !amount || numericAmount <= 0 || numericAmount > rewardBalance;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto mb-6">
      <p className="text-gray-700 text-sm mb-2">
        Reward Balance:{" "}
        <span className="font-semibold text-gray-900">
          ₦{rewardBalance.toLocaleString()}
        </span>
      </p>

      <input
        type="number"
        placeholder={`Enter amount (max ₦${rewardBalance.toLocaleString()})`}
        className={inputClasses}
        value={amount}
        onChange={(e) => {
          const val = e.target.value;
          const numericVal = parseFloat(val);
          if (!isNaN(numericVal) && numericVal > rewardBalance) {
            setAmount(rewardBalance.toString());
          } else {
            setAmount(val);
          }
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || isInvalid}
        className="w-full py-3 mt-4 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Move to Wallet"}
      </button>

      {message && (
        <p className="text-center text-sm mt-3 text-gray-800 transition-opacity duration-500">
          {message}
        </p>
      )}
    </div>
  );
}
