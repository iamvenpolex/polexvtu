// components/Footer.tsx
"use client";

import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-50 border-t py-4 px-6 text-center text-sm text-gray-500">
      <p>
        &copy; {currentYear}{" "}
        <a
          href="https://mipitech.com.ng"
          className="text-orange-500 font-semibold hover:underline"
        >
          Tap<span className="text-black">Am</span>
        </a>{" "}
        . All rights reserved.
      </p>
      <p>
        Designed with ❤️ by{" "}
        <a
          href="https://mipitech.com.ng"
          className="text-orange-500 font-semibold hover:underline"
        >
          MIPITECH
        </a>
      </p>
    </footer>
  );
}
