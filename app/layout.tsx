// app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/PageLoader";
import { AuthProvider } from "@/context/AuthContext";

// Load Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TapAm – Fast Data, TV & Electricity Payments | Mipitech",
    template: "%s",
  },
  description:
    "TapAm lets you easily buy data, manage TV subscriptions, and pay electricity bills — fast and secure with instant delivery.",
  keywords: [
    "TapAm",
    "Mipitech",
    "Data Subscription in nigeria",
    "Electricity Bill Payment",
    "TV Subscription in nigeria",
    "tapamng",
    "Tapam.ng",
    "Tapam.com.ng",
    "VTU Platform",
    "Utility Payments Nigeria",
    "cheap data in Nigeria",
    "cheap data in top up",
    "buy cheap data in nigeria",
    "affordable airtime top-up",
    "cheap electricity bills in Nigeria",
    "discounted TV subscription in nigeria",
    "TapAm VTU platform",
  ],
  authors: [{ name: "Mipitech" }],
  creator: "Mipitech",
  publisher: "Mipitech",
  metadataBase: new URL("https://tapam.mipitech.com.ng"),

  openGraph: {
    title: "TapAm – Fast Data, TV & Electricity Payments | Mipitech",
    description:
      "Buy data, pay electricity bills, and manage cable TV subscriptions instantly with TapAm by Mipitech.",
    url: "https://tapam.mipitech.com.ng",
    siteName: "TapAm",
    images: [
      {
        url: "/tapam-logo1.jpg",
        width: 1200,
        height: 630,
        alt: "TapAm – Fast Data & Bill Payments",
      },
    ],
    locale: "en_NG",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "TapAm – Fast Data, TV & Electricity Payments | Mipitech",
    description:
      "Instant payments for data, TV, and electricity bills — TapAm by Mipitech.",
    images: ["/tapam-logo1.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/tapam-logo1.jpg",
  },

  alternates: {
    canonical: "https://tapam.mipitech.com.ng",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <AuthProvider>
          <PageLoader>{children}</PageLoader>
        </AuthProvider>
      </body>
    </html>
  );
}
