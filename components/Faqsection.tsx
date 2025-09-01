"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Will my transaction be fulfilled immediately I make payment?",
      a: "Yes, all transactions are processed instantly on TapAm. Delivery is automated and takes just a few seconds.",
    },
    {
      q: "I am new here, what are the Steps to Follow?",
      a: "1. Register an account. 2. Fund your wallet. 3. Select a service (Data, Airtime, Bills, etc.) and pay instantly.",
    },
    {
      q: "How much can I trust Easy Access?",
      a: "TapAm (Easy Access) is a secure and reliable platform trusted by many users nationwide. Your transactions and data are safe with us.",
    },
    {
      q: "How do I fund my Easy Access wallet?",
      a: "You can fund your wallet through bank transfer or other payment methods available on your dashboard.",
    },
    {
      q: "Your question is not covered under this page?",
      a: "Please reach out via our contact page or email support@tapam.com and we’ll be glad to assist.",
    },
  ];

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <h3 className="text-orange-500 font-semibold uppercase tracking-wide text-sm sm:text-base text-center">
          FAQ
        </h3>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 text-center mt-2">
          Frequently Asked Questions
        </h2>
        <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>

        {/* FAQ List */}
        <div className="mt-10 space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center px-5 py-4 text-left font-medium text-blue-900 hover:text-orange-500"
              >
                {item.q}
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openIndex === index ? "rotate-180 text-orange-500" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-4 text-gray-600 text-sm sm:text-base">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
