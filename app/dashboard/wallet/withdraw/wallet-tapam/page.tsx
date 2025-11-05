"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios, { AxiosError } from "axios";
import WalletToTapamForm from "./WalletToTapamForm/page";
import Link from "next/link";
import html2canvas from "html2canvas-pro";
import { ArrowLeft, CheckCircle, Download, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

interface Receipt {
  id: string;
  reference: string;
  recipient: string;
  email: string;
  amount: number;
  date: string;
}

export default function WalletTapamPage() {
  const [amount, setAmount] = useState<number | string>("");
  const [email, setEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  // ✅ Load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);
  }, []);

  // ✅ Setup headers
  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }),
    [token]
  );

  // ✅ Fetch balance
  const fetchBalance = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wallet/balance`, {
        headers,
      });
      setWalletBalance(res.data.balance);
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      console.error("Balance error:", err.response?.data?.error || err.message);
    }
  }, [headers, token, API_BASE_URL]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // ✅ Lookup recipient
  const lookupRecipient = useCallback(async () => {
    if (!email) return setRecipientName("");
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/withdraw/tapam/lookup?email=${email}`,
        { headers }
      );
      setRecipientName(res.data.name || "");
    } catch {
      setRecipientName("");
    }
  }, [email, headers, API_BASE_URL]);

  useEffect(() => {
    const delay = setTimeout(() => lookupRecipient(), 800);
    return () => clearTimeout(delay);
  }, [email, lookupRecipient]);

  // ✅ Handle transfer
  const handleWalletToTapam = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0 || !email || !recipientName)
      return setMessage("Enter valid details");

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/withdraw/wallet-to-tapam`,
        { amount: numericAmount, email, recipientName },
        { headers }
      );

      const reference =
        res.data.reference ||
        "TX-" + Math.floor(100000 + Math.random() * 900000);

      setReceipt({
        id: reference,
        reference,
        recipient: recipientName,
        email,
        amount: numericAmount,
        date: new Date().toLocaleString(),
      });

      setMessage(res.data.message);
      setAmount("");
      setEmail("");
      setRecipientName("");
      fetchBalance();
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      setMessage(err.response?.data?.error || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Improved PDF download (fit one page + render SVG)
  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
      onclone: (docClone) => {
        const el = docClone.querySelector(".receipt-content") as HTMLElement;
        if (el) {
          el.style.backgroundColor = "#ffffff";
          el.style.color = "#000000";
          el.style.transform = "scale(1)";
        }

        // Replace CheckCircle SVG with inline PNG to ensure visibility
        const icon = el?.querySelector(".success-icon") as HTMLElement;
        if (icon) {
          const img = document.createElement("img");
          img.src =
            "data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' fill='green' viewBox='0 0 24 24'><path d='M12 0a12 12 0 1 0 12 12A12 12 0 0 0 12 0zm-1.2 17.4-4.8-4.8 1.4-1.4 3.4 3.4 6.6-6.6 1.4 1.4z'/></svg>`
            );
          img.width = 50;
          img.height = 50;
          icon.replaceWith(img);
        }
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // ✅ Scale to fit exactly one page
    const scaleFactor = Math.min(pageHeight / imgHeight, 1);
    const finalHeight = imgHeight * scaleFactor;
    const yOffset = (pageHeight - finalHeight) / 2;

    pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, finalHeight);
    pdf.save(`TapAm_Receipt_${receipt?.reference}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Send size={18} className="text-orange-600" />
            Transfer to Tapam
          </h1>
        </div>
      </header>

      {/* Main Form */}
      <main className="p-1 py-6 sm:p-6">
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
      </main>

      {/* Receipt Modal */}
      <AnimatePresence>
        {receipt && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={receiptRef}
              className="receipt-content bg-white rounded-2xl shadow-2xl p-4 text-center w-full max-w-sm mx-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Logo */}
              <div className="flex justify-center items-center mb-3">
                <h1 className="text-2xl font-extrabold">
                  <span className="text-orange-500">Tap</span>
                  <span className="text-gray-800">Am</span>
                </h1>
              </div>

              {/* Success Icon */}
              <div className="success-icon flex justify-center items-center mb-2 h-16">
                <CheckCircle className="text-green-600" size={50} />
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Transfer Successful
              </h2>

              {/* Amount */}
              <div className="text-center mb-3">
                <p className="text-gray-600 text-sm">
                  You’ve successfully sent
                </p>
                <h2 className="text-2xl font-bold text-green-600 mt-1">
                  ₦{receipt.amount.toLocaleString()}
                </h2>
                <p className="text-gray-700 text-sm">
                  to <span className="font-medium">{receipt.recipient}</span>.
                </p>
              </div>

              {/* Details */}
              <div className="bg-gray-50 rounded-lg p-3 text-left space-y-1.5 text-sm text-gray-700 border border-gray-100">
                <p>
                  <strong>Transaction Ref:</strong> {receipt.reference}
                </p>
                <p>
                  <strong>Recipient Name:</strong> {receipt.recipient}
                </p>
                <p>
                  <strong>Email:</strong> {receipt.email}
                </p>
                <p>
                  <strong>Amount:</strong> ₦{receipt.amount.toLocaleString()}
                </p>
                <p>
                  <strong>Date:</strong> {receipt.date}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-5">
                <button
                  onClick={() => setReceipt(null)}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
                >
                  Done
                </button>
                <button
                  onClick={handleDownloadReceipt}
                  className="border border-gray-300 px-6 py-2 rounded-lg text-black flex items-center gap-2 hover:bg-gray-100 transition"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
