"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BellRing, Sparkles, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
}

interface NotificationPopupProps {
  firstName: string;
}

interface ApiResponse {
  success: boolean;
  notifications?: Notification[];
  message?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://polexvtu-backend.onrender.com";

export default function NotificationPopup({
  firstName,
}: NotificationPopupProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${API_BASE_URL}/api/notifications`,
        );

        const data = response.data.notifications || [];

        setNotifications(data);

        if (data.length > 0) {
          setCurrentIndex(0);

          const timer = setTimeout(() => {
            setShow(true);
          }, 700);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading || notifications.length === 0) {
    return null;
  }

  const currentNotification = notifications[currentIndex];

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === notifications.length - 1;

  const nextNotification = () => {
    if (!isLast) {
      setCurrentIndex((previous) => previous + 1);
    }
  };

  const previousNotification = () => {
    if (!isFirst) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

  const closePopup = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && currentNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePopup}
          />

          {/* Modal */}

          <motion.div
            key={currentNotification.id}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Orange top line */}

            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

            {/* Close */}

            <button
              onClick={closePopup}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
              aria-label="Close notification"
            >
              <X size={17} />
            </button>

            <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
              {/* Small icon */}

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                  <BellRing size={21} className="text-orange-600" />
                </div>

                <div className="pr-8">
                  <div className="flex items-center gap-1 text-xs font-semibold text-orange-600">
                    <Sparkles size={13} />
                    Dashboard Information
                  </div>

                  <p className="mt-0.5 text-xs text-gray-400">
                    For {firstName}
                  </p>
                </div>
              </div>

              {/* Notification */}

              <div>
                <h2 className="text-lg font-bold leading-tight text-gray-900">
                  {currentNotification.title}
                </h2>

                <p className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                  {currentNotification.message}
                </p>
              </div>

              {/* Counter */}

              <div className="mt-5 flex items-center justify-center">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                  {currentIndex + 1} of {notifications.length}
                </span>
              </div>

              {/* Navigation */}

              {notifications.length > 1 && (
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    onClick={previousNotification}
                    disabled={isFirst}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </button>

                  <button
                    onClick={nextNotification}
                    disabled={isLast}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
                  >
                    Next
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* Close */}

              <button
                onClick={closePopup}
                className="mt-3 w-full rounded-xl py-2 text-xs font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
