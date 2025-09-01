import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Load Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose weights you want
});

export const metadata: Metadata = {
  title: "TapAm",
  description: "Data, TV Subscription, Electricity Bills & More",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
