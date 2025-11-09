import type { Metadata } from "next";
import Register from "./register";

export const metadata: Metadata = {
  title: "Create Account | TapAm",
  description:
    "Sign up on TapAm to start buying data, paying electricity bills, and managing TV subscriptions easily.",
  keywords: [
    "TapAm register",
    "TapAm sign up",
    "tapamng",
    "tapam",
    "Mipitech registration",
    "Create account TapAm",
    "cheap data in Nigeria",
    "buy cheap MTN data",
    "cheap data Nigeria",
    "cheap data top up",
    "buy data cheap",
    "affordable airtime top-up",
    "cheap electricity bills Nigeria",
    "discounted TV subscription",
    "TapAm VTU platform",
    "Tapam.com.ng",
  ],
  alternates: {
    canonical: "https://tapam.mipitech.com.ng/register",
  },
  openGraph: {
    title: "Create Account | TapAm",
    description:
      "Join TapAm by Mipitech for fast, secure, and affordable data and bill payments.",
    url: "https://tapam.mipitech.com.ng/register",
    siteName: "TapAm",
    images: ["/tapam-logo1.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Account | TapAm",
    description:
      "Sign up now on TapAm by Mipitech for instant data and utility payments.",
    images: ["/tapam-logo1.jpg"],
  },
};

export default function Page() {
  return <Register />;
}
