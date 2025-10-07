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
  title: "TapAm",
  description: "Data, TV Subscription, Electricity Bills & More",
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
          <PageLoader>{children}</PageLoader> {/* global  */}
        </AuthProvider>
      </body>
    </html>
  );
}
