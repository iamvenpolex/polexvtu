"use client";

import { motion } from "framer-motion";
import { Users, Target, Shield } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="relative py-20 px-6 sm:px-12 bg-white text-gray-800"
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-orange-500 font-semibold uppercase tracking-wide text-sm sm:text-base">
            About Us
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-2">
            We are a team of creative people <br className="hidden sm:block" />
            open to innovation
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>

          {/* Intro text */}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">
            At <span className="font-semibold text-orange-500">TapAm</span>, we
            are passionate about simplifying digital transactions. From airtime
            and data to electricity, cable TV, and result checkers — all your
            essential services are just one tap away.
          </p>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Mission */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Target className="w-10 h-10 text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Our Mission
          </h3>
          <p className="text-gray-600">
            To simplify digital transactions and provide every Nigerian with
            quick, seamless, and affordable access to essential services.
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Shield className="w-10 h-10 text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Our Vision
          </h3>
          <p className="text-gray-600">
            To become Nigeria’s most trusted platform for utility payments,
            enabling convenience and reliability with every transaction.
          </p>
        </motion.div>

        {/* Team */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Users className="w-10 h-10 text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Our Team</h3>
          <p className="text-gray-600">
            Built by passionate innovators at{" "}
            <span className="font-semibold text-orange-500">MIPI TECH</span>,
            focused on giving you secure, user-friendly, and reliable
            experiences.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
