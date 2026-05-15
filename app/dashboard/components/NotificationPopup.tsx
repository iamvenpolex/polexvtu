"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BellRing, Sparkles, ShieldCheck, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationPopupProps {
  firstName: string;
}

export default function NotificationPopup({
  firstName,
}: NotificationPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShow(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="relative w-full max-w-md overflow-hidden rounded-[30px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
          >
            {/* Top Glow */}
            <div className="absolute -top-20 right-[-40px] h-40 w-40 rounded-full bg-orange-200 blur-3xl opacity-60" />
            <div className="absolute bottom-[-60px] left-[-30px] h-32 w-32 rounded-full bg-amber-100 blur-3xl opacity-50" />

            {/* Top Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

            {/* Close Button */}
            <button
              onClick={() => setShow(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 px-6 pb-6 pt-8">
              {/* Icon */}
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200">
                <BellRing size={34} className="text-white" />
              </div>

              {/* Badge */}
              <div className="mb-4 flex justify-center">
                <div className="flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  <Sparkles size={13} />
                  Dashboard Notification
                </div>
              </div>

              {/* Heading */}
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Welcome back, {firstName}! 👋
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Your dashboard is ready. You can now manage your wallet,
                  purchase airtime & data, transfer funds, and track your
                  transactions securely.
                </p>
              </div>

              {/* Features */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100">
                    <ShieldCheck className="text-orange-600" size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Secure Transactions
                    </p>
                    <p className="text-xs text-gray-500">
                      Your account activities are protected and monitored.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100">
                    <Sparkles className="text-green-600" size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Fast & Reliable
                    </p>
                    <p className="text-xs text-gray-500">
                      Enjoy seamless VTU services anytime you need them.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => setShow(false)}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Maybe Later
                </button>

                <button
                  onClick={() => setShow(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 active:scale-[0.98]"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
