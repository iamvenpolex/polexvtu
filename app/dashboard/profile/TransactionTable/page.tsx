"use client";

import { Copy } from "lucide-react";

export interface UserTransaction {
  id: number;
  reference: string;
  amount: number;
  status: string;
  created_at: string;
  type: string;
  isCredit: boolean;
}

interface TransactionTableProps {
  transactions?: UserTransaction[];
  currentPage: number;
  transactionsPerPage: number;
  totalPages: number;
  handleNext: () => void;
  handlePrev: () => void;
}

export default function TransactionTable({
  transactions = [],
  currentPage,
  transactionsPerPage,
  totalPages,
  handleNext,
  handlePrev,
}: TransactionTableProps) {
  const indexOfLastTx = currentPage * transactionsPerPage;
  const indexOfFirstTx = indexOfLastTx - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTx, indexOfLastTx);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert(`Copied: ${text}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Transaction History
      </h2>

      <div className="space-y-3">
        {currentTransactions.map((tx) => (
          <div
            key={tx.id}
            className="p-4 rounded-lg shadow-sm border border-gray-200 bg-gray-50 flex flex-wrap justify-between items-start"
          >
            <div className="w-full sm:w-2/5">
              <p className="text-gray-700 text-xs sm:text-sm font-medium">
                {new Date(tx.created_at).toLocaleString()}
              </p>
              <p className="mt-0.5 font-semibold text-gray-800">{tx.type}</p>
              <p
                className="text-gray-600 text-xs mt-0.5 flex items-center gap-1 cursor-pointer"
                onClick={() => copyToClipboard(tx.reference)}
              >
                Ref: {tx.reference} <Copy size={14} />
              </p>
            </div>

            <div className="w-full sm:w-1/5 mt-2 sm:mt-0 text-right">
              <span
                className={`font-bold text-sm sm:text-base ${
                  tx.isCredit ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.isCredit ? "+" : "-"}₦{tx.amount.toLocaleString()}
              </span>
            </div>

            <div className="w-full sm:w-1/5 mt-2 sm:mt-0 text-right">
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor(
                  tx.status
                )}`}
              >
                {tx.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="px-3 py-1 rounded bg-orange-500 text-white text-sm disabled:bg-gray-300"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-3 py-1 rounded border border-gray-300 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-orange-500 text-white text-sm disabled:bg-gray-300"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
