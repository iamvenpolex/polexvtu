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
  transactions: UserTransaction[];
  currentPage: number;
  transactionsPerPage: number;
  totalPages: number;
  handleNext: () => void;
  handlePrev: () => void;
}

export default function TransactionTable({
  transactions,
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
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Transaction History
      </h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3 text-gray-600 text-sm">Reference</th>
                  <th className="py-2 px-3 text-gray-600 text-sm">Amount</th>
                  <th className="py-2 px-3 text-gray-600 text-sm">Type</th>
                  <th className="py-2 px-3 text-gray-600 text-sm">Status</th>
                  <th className="py-2 px-3 text-gray-600 text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td
                      className="py-2 px-3 text-black text-sm flex items-center gap-2 cursor-pointer"
                      onClick={() => copyToClipboard(tx.reference)}
                    >
                      {tx.reference} <Copy size={14} />
                    </td>
                    <td
                      className={`py-2 px-3 text-sm font-medium ${
                        tx.isCredit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.isCredit ? "+" : "-"}₦{tx.amount.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-sm text-black capitalize">
                      {tx.type}
                    </td>
                    <td
                      className={`py-2 px-3 text-sm font-semibold ${getStatusColor(
                        tx.status
                      )} capitalize`}
                    >
                      {tx.status}
                    </td>
                    <td className="py-2 px-3 text-sm text-black">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-orange-400 rounded-lg hover:bg-orange-500 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-orange-400 rounded-lg hover:bg-orange-500 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
