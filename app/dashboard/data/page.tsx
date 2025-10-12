"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type Plan = {
  plan_id: string;
  name: string;
  price: number;
  validity: string;
};

const NETWORKS: Record<
  string,
  { label: string; productTypes: { key: string; label: string }[] }
> = {
  mtn: {
    label: "MTN",
    productTypes: [
      { key: "mtn_sme", label: "SME" },
      { key: "mtn_cg_lite", label: "CG Lite" },
      { key: "mtn_cg", label: "CG" },
      { key: "mtn_awoof", label: "Awoof" },
      { key: "mtn_gifting", label: "Gifting" },
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

export default function DataPurchasePage() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("mtn");
  const [selectedProductType, setSelectedProductType] =
    useState<string>("mtn_sme");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedProductType) return;
    fetchPlans(selectedProductType);
  }, [selectedProductType]);

  // ---------- Fetch Plans ----------
  async function fetchPlans(productType: string) {
    setLoadingPlans(true);
    setError(null);
    setPlans([]);

    try {
      const res = await axios.get<{
        success: boolean;
        message: string;
        product_type: string;
        plans: Plan[];
      }>(`${BASE_URL}/api/vtu/plans/${productType}`);

      if (res.data.success) {
        setPlans(res.data.plans || []);
      } else {
        setError(res.data.message || "Failed to load plans");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        console.error("fetchPlans axios error:", message);
        setError(message);
      } else if (err instanceof Error) {
        console.error("fetchPlans error:", err.message);
        setError(err.message);
      } else {
        console.error("fetchPlans unknown error:", err);
        setError("Failed to load plans");
      }
    } finally {
      setLoadingPlans(false);
    }
  }

  // ---------- Buy Data ----------
  async function handleBuy(plan: Plan) {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid phone number (11 digits).");
      return;
    }

    const confirmed = confirm(
      `Buy ${plan.name} for ₦${plan.price} to ${phone}?`
    );
    if (!confirmed) return;

    try {
      setBuyingId(plan.plan_id);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const payload = {
        network: getNetworkCodeFromProductKey(selectedProductType),
        mobileno: phone,
        dataplan: plan.plan_id,
        client_reference: `WEB_${Date.now()}`,
      };

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await axios.post<{
        success: boolean | string;
        message: string;
      }>(`${BASE_URL}/api/vtu/buy-data`, payload, { headers });

      if (res.data.success === true || res.data.success === "true") {
        alert(res.data.message || "Purchase successful");
      } else {
        alert(res.data.message || "Purchase may have failed");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        console.error("Buy error (axios):", message);
        alert(message);
      } else if (err instanceof Error) {
        console.error("Buy error:", err.message);
        alert(err.message);
      } else {
        console.error("Buy unknown error:", err);
        alert("Purchase failed");
      }
    } finally {
      setBuyingId(null);
    }
  }

  function getNetworkCodeFromProductKey(productKey?: string) {
    if (!productKey) return "01";
    if (productKey.startsWith("mtn")) return "01";
    if (productKey.startsWith("glo")) return "02";
    if (productKey.startsWith("airtel")) return "03";
    if (productKey.startsWith("9mobile")) return "04";
    return "01";
  }

  // ---------- Render ----------
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Buy Data</h1>
        <p style={styles.subtitle}>
          Select network, pick product type, choose plan — instant delivery.
        </p>
      </div>

      {/* Network Buttons */}
      <div style={styles.networkBar}>
        {Object.entries(NETWORKS).map(([key, meta]) => {
          const active = key === selectedNetwork;
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedNetwork(key);
                setSelectedProductType(NETWORKS[key].productTypes[0].key);
                setPlans([]);
              }}
              style={{
                ...styles.networkButton,
                ...(active ? styles.networkButtonActive : {}),
              }}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Product Types */}
      <div style={styles.productTypes}>
        {selectedNetwork &&
          NETWORKS[selectedNetwork].productTypes.map((pt) => {
            const active = pt.key === selectedProductType;
            return (
              <button
                key={pt.key}
                onClick={() => setSelectedProductType(pt.key)}
                style={{
                  ...styles.productTypeButton,
                  ...(active ? styles.productTypeButtonActive : {}),
                }}
              >
                {pt.label}
              </button>
            );
          })}
      </div>

      {/* Phone Input */}
      <div style={styles.controlsRow}>
        <input
          placeholder="Enter phone number (e.g. 0803xxxxxxx)"
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

      {/* Error */}
      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Plans */}
      <div style={styles.plansGrid}>
        {loadingPlans ? (
          <div style={styles.loading}>Loading plans…</div>
        ) : plans.length === 0 ? (
          <div style={styles.noPlans}>
            No plans found for selected product type.
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.plan_id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.planName}>{plan.name}</div>
                <div style={styles.planPrice}>₦{plan.price}</div>
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
                  disabled={Boolean(buyingId)}
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
const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 20,
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  },
  header: { marginBottom: 18 },
  title: { margin: 0, fontSize: 24, fontWeight: 700, color: "orange" },
  subtitle: { margin: 0, color: "#666", marginTop: 6 },

  networkBar: {
    display: "flex",
    gap: 10,
    marginTop: 16,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  networkButton: {
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid #eee",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    color: "black",
  },
  networkButtonActive: {
    background: ORANGE,
    color: "#fff",
    border: `1px solid ${ORANGE}`,
  },

  productTypes: {
    display: "flex",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
    color: "black",
  },
  productTypeButton: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #eee",
    background: "#fff",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  },
  productTypeButtonActive: {
    background: "#fff7f1",
    border: `1px solid ${ORANGE}`,
    color: ORANGE,
  },

  controlsRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  phoneInput: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    minWidth: 220,
    color: "black",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
    alignItems: "stretch",
  },
  loading: { padding: 20 },
  noPlans: { padding: 10, color: "#666" },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 14,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "black",
    minHeight: 130,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: { fontWeight: 700 },
  planPrice: { fontWeight: 800, color: ORANGE, fontSize: 18 },
  cardBody: { marginTop: 10, color: "#444" },
  validity: { fontSize: 13, color: "#666" },
  features: { fontSize: 12, color: "#888", marginTop: 6 },
  cardFooter: { marginTop: 12, display: "flex", justifyContent: "flex-end" },
  buyButton: {
    background: ORANGE,
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: 8,
    fontWeight: 700,
    cursor: "pointer",
  },
};
