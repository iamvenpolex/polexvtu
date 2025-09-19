"use client";

interface Props {
  amount: number;
  setAmount: (val: number) => void;
  handleSubmit: () => void;
  loading: boolean;
  message: string;
  rewardBalance: number;
}

export default function RewardToWalletForm({
  amount,
  setAmount,
  handleSubmit,
  loading,
  message,
  rewardBalance,
}: Props) {
  const inputClasses =
    "w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900";

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto mb-6">
      <p className="text-gray-600 text-sm mb-2">
        Reward Balance: ₦{rewardBalance.toLocaleString()}
      </p>
      <input
        type="number"
        placeholder={`Enter amount (max ₦${rewardBalance.toLocaleString()})`}
        className={inputClasses}
        value={amount}
        onChange={(e) => {
          const val = Number(e.target.value);
          setAmount(val > rewardBalance ? rewardBalance : val);
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || amount <= 0 || amount > rewardBalance}
        className="w-full py-3 mt-4 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Move to Wallet"}
      </button>
      {message && (
        <p className="text-center text-sm mt-2 text-gray-700">{message}</p>
      )}
    </div>
  );
}
