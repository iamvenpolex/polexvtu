"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import NotificationPopup from "./components/NotificationPopup";
import InfoTicker from "@/components/InfoTicker";
import Navbar from "./components/Navbar";

import axios, { AxiosError } from "axios";
import {
  Wifi,
  Eye,
  EyeOff,
  Gift,
  Wallet,
  PhoneCall,
  Send,
  Lightbulb,
  GraduationCap,
  Tv,
  History,
  MoreHorizontal,
  Copy,
} from "lucide-react";
import Link from "next/link";

// ------------------------
// Types
// ------------------------

interface User {
  id: number;
  first_name: string;
  last_name: string;
  balance: number;
  reward: number;
  email: string;
}

interface VirtualAccount {
  customer_id?: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_code?: string;
  reserved_account_id?: string;
}

interface ApiError {
  message: string;
}

// ------------------------
// API Base URL
// ------------------------

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://polexvtu-backend.onrender.com";

// ------------------------
// Auth helpers
// ------------------------

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("firstName");
}

export default function DashboardPage() {
  const router = useRouter();

  // ------------------------
  // States
  // ------------------------

  const [authChecked, setAuthChecked] = useState(false);

  // Balance is hidden when dashboard first opens
  const [showBalance, setShowBalance] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(true);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const [error, setError] = useState("");
  const [accountError, setAccountError] = useState("");

  const [firstName, setFirstName] = useState("User");

  // ------------------------
  // Redirect
  // ------------------------

  const redirectToLogin = useCallback(
    (reason?: string) => {
      clearSession();

      if (reason) {
        console.warn("[Auth]", reason);
      }

      router.replace("/login");
    },
    [router],
  );

  // ------------------------
  // Auth guard
  // ------------------------

  useEffect(() => {
    const token = getToken();

    if (!token) {
      redirectToLogin("No token found");
      return;
    }

    if (isTokenExpired(token)) {
      redirectToLogin("Token expired");
      return;
    }

    setFirstName(localStorage.getItem("firstName") || "User");
    setAuthChecked(true);
  }, [redirectToLogin]);

  // ------------------------
  // Fetch user profile
  // ------------------------

  const fetchUserData = useCallback(async () => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      redirectToLogin("Session expired during fetch");
      return;
    }

    try {
      const response = await axios.get<User>(
        `${API_BASE_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser(response.data);
      setError("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<ApiError>;
        const status = axiosErr.response?.status;

        if (status === 401 || status === 403) {
          redirectToLogin("Server rejected token");
          return;
        }

        setError(
          axiosErr.response?.data?.message ||
            "Failed to fetch wallet information",
        );
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [redirectToLogin]);

  // ------------------------
  // Fetch virtual account
  // ------------------------

  const fetchVirtualAccount = useCallback(async () => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      redirectToLogin("Session expired");
      return;
    }

    try {
      setAccountLoading(true);
      setAccountError("");

      const response = await axios.get(`${API_BASE_URL}/api/virtual-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.hasAccount) {
        setVirtualAccount(response.data.account);
      } else {
        setVirtualAccount(null);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401 || status === 403) {
          redirectToLogin("Server rejected token");
          return;
        }

        setAccountError(
          err.response?.data?.message || "Failed to load virtual account",
        );
      } else {
        setAccountError("Failed to load virtual account");
      }
    } finally {
      setAccountLoading(false);
    }
  }, [redirectToLogin]);

  // ------------------------
  // Create virtual account
  // ------------------------

  const createVirtualAccount = async () => {
    const token = getToken();

    if (!token || isTokenExpired(token)) {
      redirectToLogin("Session expired");
      return;
    }

    try {
      setCreatingAccount(true);
      setAccountError("");

      const response = await axios.post(
        `${API_BASE_URL}/api/virtual-account/create`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.account) {
        setVirtualAccount(response.data.account);
      } else {
        await fetchVirtualAccount();
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setAccountError(
          err.response?.data?.message || "Unable to create virtual account",
        );
      } else {
        setAccountError("Unable to create virtual account");
      }
    } finally {
      setCreatingAccount(false);
    }
  };

  // ------------------------
  // Copy account number
  // ------------------------

  const copyAccountNumber = async () => {
    if (!virtualAccount?.account_number) return;

    try {
      await navigator.clipboard.writeText(virtualAccount.account_number);

      alert("Account number copied");
    } catch {
      console.error("Failed to copy account number");
    }
  };

  // ------------------------
  // Initial fetch
  // ------------------------

  useEffect(() => {
    if (!authChecked) return;

    fetchUserData();
    fetchVirtualAccount();

    const interval = setInterval(() => {
      fetchUserData();
      fetchVirtualAccount();
    }, 45000);

    return () => clearInterval(interval);
  }, [authChecked, fetchUserData, fetchVirtualAccount]);

  // ------------------------
  // Auth loading
  // ------------------------

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />

          <p className="text-sm text-gray-500">Verifying session…</p>
        </div>
      </div>
    );
  }

  // ------------------------
  // Dashboard
  // ------------------------

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <Navbar />

      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        <InfoTicker message="🔥 Special VTU Offer: Get 50% OFF on your first recharge! Limited time only! 🔥" />

        {/* ---------------- Wallet Dashboard ---------------- */}

        <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <h1 className="text-base sm:text-xl font-semibold text-orange-600">
              Hi, {firstName} 👋
            </h1>

            {user && !loading && (
              <Link
                href="/transactions"
                className="inline-flex items-center px-3 py-1 text-xs sm:text-sm bg-orange-600 text-white rounded-full hover:bg-orange-700 transition"
              >
                History
              </Link>
            )}
          </div>

          <NotificationPopup firstName={firstName} />

          {loading && (
            <p className="mt-3 text-gray-500">Loading wallet info...</p>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {user && !loading && (
            <div className="mt-3 flex items-center justify-between">
              {/* Wallet Balance */}

              <div>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Wallet Balance
                </p>

                <h2 className="text-xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  {showBalance
                    ? `₦${Number(user.balance || 0).toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "****"}

                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </h2>
              </div>

              {/* Reward */}

              <div className="text-right">
                <p className="text-gray-500 text-xs sm:text-sm">
                  Reward Balance
                </p>

                <div className="flex items-center gap-2 text-green-600 font-semibold text-sm sm:text-base">
                  {showReward
                    ? `₦${Number(user.reward || 0).toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "₦0.00"}

                  <button
                    onClick={() => setShowReward(!showReward)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showReward ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>

                  <Gift size={16} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- Virtual Account ---------------- */}

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-700">
                Fund Your Wallet
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Transfer money to your personal account number
              </p>
            </div>
          </div>

          {accountLoading && (
            <p className="text-sm text-gray-500">Checking account...</p>
          )}

          {!accountLoading && virtualAccount && (
            <div className="border border-orange-100 bg-orange-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Bank</p>

                  <p className="font-semibold text-gray-800">
                    {virtualAccount.bank_name}
                  </p>
                </div>

                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500">Account Number</p>

                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-800 tracking-wide">
                    {virtualAccount.account_number}
                  </p>

                  <button
                    onClick={copyAccountNumber}
                    className="p-2 rounded-lg hover:bg-orange-100 text-orange-600"
                    title="Copy account number"
                  >
                    <Copy size={18} />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {virtualAccount.account_name}
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Transfer to this account to fund your TapAm wallet.
              </p>

              {/* PaymentPoint Service Fee Notice */}

              <div className="mt-3 rounded-lg border border-orange-200 bg-orange-100 px-3 py-2.5">
                <p className="text-xs text-orange-800 leading-relaxed">
                  <strong>Service fee:</strong> Transfers made to this personal
                  account number via PaymentPoint attract a{" "}
                  <strong>0.5% service fee</strong>. The fee will be deducted
                  from the amount credited to your TapAm wallet.
                </p>

                <p className="text-[11px] text-orange-700 mt-1.5">
                  Example: A ₦10,000 transfer will credit ₦9,950 to your wallet
                  after the ₦50 service fee.
                </p>
              </div>
            </div>
          )}

          {!accountLoading && !virtualAccount && (
            <div className="text-center border border-dashed border-gray-300 rounded-xl p-5">
              <p className="text-sm text-gray-600 mb-3">
                You don&apos;t have a personal account number yet.
              </p>

              <button
                onClick={createVirtualAccount}
                disabled={creatingAccount}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition"
              >
                {creatingAccount ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          )}

          {accountError && (
            <p className="text-red-500 text-sm mt-3">{accountError}</p>
          )}
        </div>

        {/* ---------------- Compact Fund Wallet ---------------- */}

        <div className="bg-white rounded-xl shadow-md px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/dashboard/wallet/fund"
                className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 px-2 py-1"
              >
                Fund via Paystack
              </Link>

              <Link
                href="/transactions"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-2"
              >
                <History size={15} />
                History
              </Link>
            </div>
          </div>
        </div>

        {/* ---------------- Updates ---------------- */}

        <div className="bg-white rounded-xl shadow-md p-2 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-700">
            📢 Latest Update: New discounts available on MTN data bundles!
          </p>
        </div>

        {/* ---------------- Withdraw / Reward ---------------- */}

        <div className="bg-white rounded-xl shadow-md p-3 sm:p-6">
          <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
            Withdraw / Reward
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <Link
              href="/dashboard/wallet/withdraw/wallet-tapam"
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 sm:py-4 rounded-lg shadow text-xs sm:text-sm"
            >
              <Send size={18} />
              Transfer
            </Link>

            <Link
              href="/dashboard/wallet/withdraw/reward-wallet"
              className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow text-xs sm:text-sm"
            >
              <Gift size={18} />
              Reward to Wallet
            </Link>

            <Link
              href="/transactions"
              className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow text-xs sm:text-sm col-span-2 sm:col-span-1"
            >
              <History size={18} />
              View History
            </Link>
          </div>
        </div>

        {/* ---------------- Services ---------------- */}

        <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 space-y-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-700">
            Services
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/dashboard/airtime"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
              Airtime
            </Link>

            <Link
              href="/dashboard/data"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <Wifi className="w-5 h-5 sm:w-6 sm:h-6" />
              Data
            </Link>

            <Link
              href="/dashboard/electricity"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
              Electricity
            </Link>

            <Link
              href="/dashboard/education"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              Education
            </Link>

            <Link
              href="/dashboard/cabletv"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <Tv className="w-5 h-5 sm:w-6 sm:h-6" />
              Cable TV
            </Link>

            <Link
              href="/dashboard/more"
              className="flex flex-col items-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 sm:py-4 rounded-lg shadow transition text-xs sm:text-sm"
            >
              <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
              More
            </Link>
          </div>
        </div>

        {/* ---------------- ADS BANNER ---------------- */}

        <div className="relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-100 shadow-xl my-6">
          <div className="absolute -top-10 -left-10 h-32 w-32 bg-orange-300/30 blur-3xl rounded-full" />

          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-yellow-300/30 blur-3xl rounded-full" />

          <div className="absolute top-3 left-4 text-2xl animate-bounce">
            🔥
          </div>

          <div className="absolute bottom-3 right-4 text-2xl animate-pulse">
            ⚡
          </div>

          <div className="relative z-10 px-6 py-6 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md mb-3">
              LIMITED OFFER
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-orange-800 leading-tight">
              Get <span className="text-red-600">50% OFF</span> Your First
              Recharge
            </h2>

            <p className="text-sm text-orange-700 mt-2">
              Fast VTU services for airtime, data & bills — anytime, anywhere.
            </p>

            <button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition active:scale-95">
              Recharge Now
            </button>

            <p className="text-[11px] text-orange-600 mt-3 opacity-80">
              ⏳ Offer ends soon — don&apos;t miss out!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
