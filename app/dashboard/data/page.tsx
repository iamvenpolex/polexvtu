"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ---------- Types ----------
type Plan = {
  plan_id: string;
  name: string;
  price: number;
  custom_price?: number;
  validity: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  plans: Plan[];
};

type BuyDataResponse = {
  success: boolean;
  message?: string;
  reference?: string;
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

// ---------- Networks & Product Types ----------
const NETWORKS: Record<
  string,
  { label: string; productTypes: { key: string; label: string }[] }
> = {
  mtn: {
    label: "MTN",
    productTypes: [
      { key: "mtn_cg", label: "CG" },
      { key: "mtn_awoof", label: "Awoof" },
      { key: "mtn_gifting", label: "Gifting" },
      { key: "mtn_sme", label: "SME" },
      { key: "mtn_cg_lite", label: "CG Lite" },
    ],
  },
  glo: {
    label: "GLO",
    productTypes: [
      { key: "glo_cg", label: "CG" },
      { key: "glo_awoof", label: "Awoof" },
      { key: "glo_gifting", label: "Gifting" },
    ],
  },
  airtel: {
    label: "AIRTEL",
    productTypes: [
      { key: "airtel_cg", label: "CG" },
      { key: "airtel_awoof", label: "Awoof" },
      { key: "airtel_gifting", label: "Gifting" },
    ],
  },
  "9mobile": {
    label: "9MOBILE",
    productTypes: [
      { key: "9mobile_sme", label: "SME" },
      { key: "9mobile_gifting", label: "Gifting" },
    ],
  },
};

// ---------- DataPurchasePage ----------
export default function DataPurchasePage() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("mtn");
  const [selectedProductType, setSelectedProductType] =
    useState<string>("mtn_sme");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type?: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (selectedProductType) fetchPlans(selectedProductType);
  }, [selectedProductType]);

  // ---------- Fetch Plans ----------
  async function fetchPlans(productType: string) {
    setLoadingPlans(true);
    setError(null);
    setPlans([]);
    try {
      const res = await axios.get<ApiResponse>(
        `${BASE_URL}/api/vtu/plans/${productType}`
      );
      if (res.data.success) setPlans(res.data.plans);
      else setError(res.data.message || "Failed to load plans");
    } catch (err) {
      console.error(err);
      setError("Failed to load plans");
    } finally {
      setLoadingPlans(false);
    }
  }

  // ---------- Get Network Code ----------
  function getNetworkCode(productKey?: string): string {
    if (!productKey) return "01";
    if (productKey.startsWith("mtn")) return "01";
    if (productKey.startsWith("glo")) return "02";
    if (productKey.startsWith("airtel")) return "03";
    if (productKey.startsWith("9mobile")) return "04";
    return "01";
  }

  // ---------- Buy Data ----------
  async function handleBuy(plan: Plan) {
    if (!phone || phone.length !== 11) {
      setMessage({
        text: "Enter a valid 11-digit phone number",
        type: "error",
      });
      return;
    }

    const client_reference = `ref_${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}`;
    const displayPrice = plan.custom_price ?? plan.price;

    if (
      !confirm(
        `         PLEASE CONFIRM DETAILS BEFORE PROCEEDING
        Buy ${plan.name} for ₦${displayPrice}? to phone number ${phone}?`
      )
    )
      return;

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
        network: getNetworkCode(selectedProductType),
        mobile_no: phone,
        dataplan: plan.plan_id,
        client_reference,
      };

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await axios.post<BuyDataResponse>(
        `${BASE_URL}/api/buydata`,
        payload,
        { headers }
      );
      console.log("Backend response:", res.data);

      if (res.data.success) {
        setMessage({
          text: `Purchase successful!\nAmount: ₦${displayPrice}\nReference: ${res.data.reference}`,
          type: "success",
        });
      } else {
        setMessage({
          text: res.data.message || "Purchase failed",
          type: "error",
        });
      }
    } catch (err: unknown) {
      console.error("Buy error:", err);
      setMessage({ text: "Purchase failed. Please try again.", type: "error" });
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.back}>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      <h1 style={styles.title}>Buy Data</h1>

      {/* Network buttons */}
      <div style={styles.networkBar}>
        {Object.entries(NETWORKS).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedNetwork(key);
              setSelectedProductType(meta.productTypes[0].key);
              setPlans([]);
            }}
            style={{
              ...styles.networkButton,
              ...(key === selectedNetwork ? styles.networkButtonActive : {}),
            }}
          >
            {meta.label}
          </button>
        ))}
      </div>

      {/* Product types */}
      <div style={styles.productTypes}>
        {NETWORKS[selectedNetwork].productTypes.map((pt) => (
          <button
            key={pt.key}
            onClick={() => setSelectedProductType(pt.key)}
            style={{
              ...styles.productTypeButton,
              ...(pt.key === selectedProductType
                ? styles.productTypeButtonActive
                : {}),
            }}
          >
            {pt.label}
          </button>
        ))}
      </div>

      {/* Phone input */}
      <div style={styles.controlsRow}>
        <input
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.phoneInput}
        />
        <button
          onClick={() => fetchPlans(selectedProductType)}
          style={styles.refreshButton}
          disabled={loadingPlans}
        >
          {loadingPlans ? "Loading..." : "Refresh Plans"}
        </button>
      </div>

      {/* Message box */}
      {message && (
        <MessageBox
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Error */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Plans grid */}
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
                  ₦{plan.custom_price ?? plan.price}
                </div>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.validity}>Validity: {plan.validity}</div>
                <div style={styles.features}>
                  Instant delivery • Auto-refund supported
                </div>
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
  productTypes: {
    display: "flex",
    gap: 6,
    marginBottom: 12,
    flexWrap: "wrap",
    overflowX: "auto",
  },
  productTypeButton: {
    padding: "4px 8px",
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    color: DARK_TEXT,
    minWidth: 60,
    textAlign: "center",
  },
  productTypeButtonActive: {
    background: "#fff7f1",
    border: `1px solid ${ORANGE}`,
    color: ORANGE,
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
  errorBox: {
    background: "#ffe9e6",
    padding: 12,
    borderRadius: 8,
    color: "#b00000",
    marginBottom: 12,
  },
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 14,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: DARK_TEXT,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: { fontWeight: 700, fontSize: 14, color: DARK_TEXT },
  planPrice: { fontWeight: 800, color: ORANGE, fontSize: 16 },
  cardBody: { marginTop: 8 },
  validity: { fontSize: 13, color: DARK_TEXT },
  features: { fontSize: 12, color: "#444", marginTop: 4 },
  cardFooter: { marginTop: 10, display: "flex", justifyContent: "flex-end" },
  buyButton: {
    background: ORANGE,
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
};
