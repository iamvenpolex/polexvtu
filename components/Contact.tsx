"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-20 px-6 sm:px-12 bg-gray-50 text-gray-800"
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-orange-500 font-semibold uppercase tracking-wide text-sm sm:text-base">
            Contact Us
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-2">
            Get in Touch With Us
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            Have questions or need help? We’d love to hear from you. Reach out
            anytime and our team will respond as soon as possible.
          </p>
        </motion.div>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 bg-white shadow-md p-5 rounded-xl">
            <Phone className="w-6 h-6 text-orange-500" />
            <div>
              <p className="font-semibold text-gray-900">Phone</p>
              <p className="text-gray-600">+234 812 345 6789</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white shadow-md p-5 rounded-xl">
            <Mail className="w-6 h-6 text-orange-500" />
            <div>
              <p className="font-semibold text-gray-900">Email</p>
              <p className="text-gray-600">support@mipitech.com.ng</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white shadow-md p-5 rounded-xl">
            <MapPin className="w-6 h-6 text-orange-500" />
            <div>
              <p className="font-semibold text-gray-900">Office</p>
              <p className="text-gray-600">Lagos, Nigeria</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          className="bg-white shadow-lg p-8 rounded-2xl space-y-5"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              placeholder="Write your message..."
              rows={4}
              className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-orange-600 transition"
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </section>
  );
}
