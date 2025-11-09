"use client";

import { motion } from "framer-motion";

interface InfoTickerProps {
  message: string;
}

const InfoTicker: React.FC<InfoTickerProps> = ({ message }) => {
  return (
    <div className="w-full overflow-hidden bg-orange-50 border border-orange-300 rounded-lg py-2">
      <motion.div
        className="whitespace-nowrap text-orange-700 font-semibold"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      >
        {message}
      </motion.div>
    </div>
  );
};

export default InfoTicker;
