"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, Tv } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ---------- Types ----------
type Plan = {
  plan_id: string;
  name: string;
  price: number; // EasyAccess price
  customPrice?: number; // Admin-set price
  validity: string;
};

type VerifiedAccount = {
  account_name: string;
  status: string;
  iucno?: string;
  due_date?: string;
  bouquet?: string;
  [key: string]: string | undefined;
};

type BuyCableResponse = {
  success: boolean;
  data?: {
    transaction_id?: string;
    amount?: number;
    reference?: string;
    [key: string]: unknown;
  };
  message?: string;
};

// ---------- Message Component ----------
type MessageBoxProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
};

function MessageBox({ message, type = "info", onClose }: MessageBoxProps) {
  const bgColor =
    type === "success" ? "#e6f9ec" : type === "error" ? "#ffe9e6" : "#e6f0ff";
  const textColor =
    type === "success" ? "#027a36" : type === "error" ? "#b00000" : "#1a3c91";

  return (
    <div
      style={{
        background: bgColor,
        color: textColor,
        padding: "12px 16px",
        borderRadius: 8,
        marginBottom: 12,
        position: "relative",
        border: `1px solid ${textColor}`,
      }}
    >
      {message}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            border: "none",
            background: "transparent",
            color: textColor,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// ---------- CableTV Networks ----------
const CABLE_NETWORKS: Record<string, { label: string }> = {
  dstv: { label: "DSTV" },
  gotv: { label: "GOTV" },
  startimes: { label: "STARTIMES" },
  showmax: { label: "SHOWMAX" },
};

// ---------- CableTV Page ----------
export default function CableTVPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>("dstv");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [iuc, setIuc] = useState("");
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false); // ✅ added verifying state
  const [verifyResult, setVerifyResult] = useState<VerifiedAccount | null>(
    null
  );
  const [message, setMessage] = useState<{
    text: string;
    type?: "success" | "error" | "info";
  } | null>(null);

  // ---------- Fetch plans ----------
  useEffect(() => {
    fetchPlans(selectedCompany);
  }, [selectedCompany]);

  async function fetchPlans(company: string) {
    setLoadingPlans(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await axios.get(`${BASE_URL}/api/cabletv/${company}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPlans(res.data.plans);
      } else {
        setMessage({
          text: res.data.message || "Failed to load plans",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to load plans", type: "error" });
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  }

  // ---------- Verify IUC ----------
  async function handleVerify() {
    if (!iuc) {
      setMessage({ text: "Please enter your IUC number", type: "error" });
      return;
    }

    setVerifying(true); // ✅ start verifying
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(
        `${BASE_URL}/api/buycabletv/verify`,
        {
          company: selectedCompany,
          iucno: iuc,
        },
        { headers }
      );

      const successFlag = res.data.success === true;
      const content = res.data.data as Record<string, string> | undefined;

      if (successFlag && content?.Status === "ACTIVE") {
        setVerifyResult({
          account_name: content.Customer_Name ?? "N/A",
          status: content.Status,
          iucno: iuc,
          due_date: content.Due_Date,
          bouquet: content.Current_Bouquet ?? "N/A",
        });
        setMessage({ text: "Verification successful", type: "success" });
      } else {
        setVerifyResult(null);
        setMessage({
          text: content?.Status
            ? `Verification failed: ${content.Status}`
            : res.data.message || "Verification failed",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setVerifyResult(null);
      setMessage({ text: "Verification failed. Try again.", type: "error" });
    } finally {
      setVerifying(false); // ✅ done verifying
    }
  }

  // ---------- Buy Plan ----------
  async function handleBuy(plan: Plan) {
    if (!iuc) {
      setMessage({ text: "Please enter your IUC number", type: "error" });
      return;
    }

    const client_reference = `ref_${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}`;
    const displayPrice = plan.customPrice ?? plan.price;

    if (!confirm(`Buy ${plan.name} for ₦${displayPrice}?`)) return;

    try {
      setBuyingId(plan.plan_id);
      const token = localStorage.getItem("token");
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        setMessage({ text: "User not logged in", type: "error" });
        return;
      }

      const payload = {
        user_id,
        company: selectedCompany,
        iucno: iuc,
        packageId: plan.plan_id,
        maxAmountPayable: displayPrice,
        client_reference,
      };

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await axios.post<BuyCableResponse>(
        `${BASE_URL}/api/buycabletv/buy`,
        payload,
        { headers }
      );

      if (res.data.success) {
        setMessage({
          text: `Purchase successful! Reference: ${res.data.data?.reference}`,
          type: "success",
        });
      } else {
        setMessage({
          text: res.data.message || "Purchase failed",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Purchase failed. Try again.", type: "error" });
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.back}>
        <div className=" sticky flex items-center gap-3 px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-9 h-9 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Tv size={18} className="text-orange-600" />
            Cable TV Subscription
          </h1>
        </div>
      </div>

      {/* Provider Buttons */}
      <div style={styles.networkBar}>
        {Object.entries(CABLE_NETWORKS).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setSelectedCompany(key)}
            style={{
              ...styles.networkButton,
              ...(key === selectedCompany ? styles.networkButtonActive : {}),
            }}
          >
            {meta.label}
          </button>
        ))}
      </div>

      {/* IUC Input */}
      <div style={styles.controlsRow}>
        <input
          placeholder="Enter IUC Number"
          value={iuc}
          onChange={(e) => setIuc(e.target.value)}
          style={styles.phoneInput}
        />
        <button
          onClick={handleVerify}
          style={styles.verifyButton}
          disabled={verifying} // ✅ disable while verifying
        >
          {verifying ? "Verifying..." : "Verify"} {/* ✅ show state */}
        </button>
        <button
          onClick={() => fetchPlans(selectedCompany)}
          style={styles.refreshButton}
          disabled={loadingPlans}
        >
          {loadingPlans ? "Loading..." : "Refresh Plans"}
        </button>
      </div>

      {/* Verification Result */}
      {verifyResult && (
        <div style={styles.verifyResult} className="text-green-800">
          <strong className="text-orange-600">Account Name:</strong>{" "}
          {verifyResult.account_name || "N/A"} <br />
          <strong className="text-orange-600">Status:</strong>{" "}
          {verifyResult.status || "N/A"} <br />
          <strong className="text-orange-600">Due Date:</strong>{" "}
          {verifyResult.due_date || "N/A"} <br />
          <strong className="text-orange-600">Bouquet:</strong>{" "}
          {verifyResult.bouquet || "N/A"} <br />
        </div>
      )}

      {/* Message */}
      {message && (
        <MessageBox
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Plans Grid */}
      <div style={styles.plansGrid}>
        {loadingPlans ? (
          <div>Loading plans…</div>
        ) : plans.length === 0 ? (
          <div>No plans found.</div>
        ) : (
          plans.map((plan) => (
            <div key={plan.plan_id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.planName}>{plan.name}</div>
                <div style={styles.planPrice}>
                  ₦{plan.customPrice ?? plan.price}
                </div>
              </div>
              <div style={styles.cardBody}>
                Instant delivery • Validity: {plan.validity}
              </div>
              <div style={styles.cardFooter}>
                <button
                  onClick={() => handleBuy(plan)}
                  disabled={buyingId === plan.plan_id}
                  style={styles.buyButton}
                >
                  {buyingId === plan.plan_id ? "Processing..." : "Buy Now"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------- Styles ----------
const ORANGE = "#ff8a00";
const DARK_TEXT = "#222";

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 16,
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  },
  title: { fontSize: 22, fontWeight: 700, color: ORANGE, marginBottom: 12 },
  back: { position: "sticky", marginBottom: 12 },
  networkBar: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
    overflowX: "auto",
  },
  networkButton: {
    padding: "6px 10px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    color: DARK_TEXT,
    minWidth: 70,
    textAlign: "center",
  },
  networkButtonActive: {
    background: ORANGE,
    color: "#fff",
    border: `1px solid ${ORANGE}`,
  },
  controlsRow: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" },
  phoneInput: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    flex: 1,
    minWidth: 140,
    color: DARK_TEXT,
  },
  refreshButton: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: ORANGE,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  verifyButton: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "#027a36",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  },
  card: {
    borderRadius: 12,
    border: "1px solid #ddd",
    padding: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "#fff",
  },
  cardHeader: {
    marginBottom: 6,
    display: "flex",
    justifyContent: "space-between",
  },
  planName: { fontWeight: 700, fontSize: 14, color: DARK_TEXT },
  planPrice: { fontWeight: 700, color: ORANGE },
  cardBody: { fontSize: 12, color: "#555", marginBottom: 6 },
  cardFooter: {},
  buyButton: {
    padding: "6px 12px",
    borderRadius: 8,
    border: "none",
    background: ORANGE,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
  },
  verifyResult: {
    border: "1px solid #ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    background: "#f9f9f9",
    fontSize: 13,
  },
};
