"use client";

interface Props {
  amount: number;
  setAmount: (val: number) => void;
  email: string;
  setEmail: (val: string) => void;
  recipientName: string;
  handleSubmit: () => void;
  loading: boolean;
  message: string;
  walletBalance?: number; // ✅ optional now
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
  walletBalance = 0, // ✅ default to 0
}: Props) {
  const inputClasses =
    "w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900";

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto mb-6">
      <p className="text-gray-600 text-sm mb-2">
        Wallet Balance: ₦{walletBalance.toLocaleString()}
      </p>

      <input
        type="email"
        placeholder="Recipient Email"
        className={inputClasses + " mb-2"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {recipientName && (
        <p className="text-green-600 text-sm mb-2">
          Recipient: {recipientName}
        </p>
      )}
      {!recipientName && email && (
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
          loading || amount <= 0 || amount > walletBalance || !recipientName
        }
        className="w-full py-3 mt-4 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Send Funds"}
      </button>

      {message && (
        <p className="text-center text-sm mt-2 text-gray-700">{message}</p>
      )}
    </div>
  );
}
