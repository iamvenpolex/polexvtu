// app/login/page.tsx
import type { Metadata } from "next";
import Login from "./login";

export const metadata: Metadata = {
  title: "Login | TapAm",
  description:
    "Login to your TapAm account to access data bundles, TV subscriptions, and electricity bill payments.",
  keywords: [
    "TapAm login",
    "VTU login",
    "Data login",
    "Electricity bill login",
    "TV subscription login",
    "Cheapest data",
    "cheap data Nigeria",
    "cheap data top up",
    "buy data cheap",
    "affordable airtime top-up",
    "cheap electricity bills Nigeria",
    "discounted TV subscription",
    "TapAm VTU platform",
  ],
  openGraph: {
    title: "Login | TapAm",
    description:
      "Login to your TapAm account to manage data, TV, and electricity payments easily.",
    url: "https://tapam.mipitech.com.ng/login",
    siteName: "TapAm",
    images: [
      {
        url: "https://tapam.mipitech.com.ng/tapam-logo1.jpg",
        width: 1200,
        height: 630,
        alt: "TapAm Login Page",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://tapam.mipitech.com.ng/login",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <Login />;
}
