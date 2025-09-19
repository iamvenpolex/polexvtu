// app/dashboard/utils/wallet.ts
import { apiFetch } from "./api";

export async function fundWallet(amount: number, email: string) {
  if (!email) throw new Error("Email is required");

  const data = await apiFetch<{ authorization_url: string }>(
    "http://localhost:5000/api/wallet/fund",
    {
      method: "POST",
      data: { amount, email },
    }
  );

  // Redirect user to Paystack payment page
  window.location.href = data.authorization_url;
}
