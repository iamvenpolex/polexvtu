"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About / Brand */}
        <div>
          <h2 className="text-2xl font-bold text-orange-500 mb-3">
            Tap<span className="text-white">Am</span>
          </h2>
          <p className="text-gray-400">
            Your one-stop platform to pay bills, buy data, subscribe TV, and
            recharge airtime seamlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="hover:text-orange-500 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-orange-500 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-orange-500 transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-orange-500 transition">
                FAQ
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-orange-500 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <p className="flex items-center gap-2 mb-2">
            <Mail size={16} /> support@mipitech.com.ng
          </p>
          <p className="flex items-center gap-2 mb-4">
            <Phone size={16} /> +234 803 264 8367
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-orange-500">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-orange-500">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-orange-500">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-orange-500">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright / designed by */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-500 text-sm flex flex-col sm:flex-row justify-center items-center gap-2">
        <span>
          &copy; {new Date().getFullYear()} TapAm. All rights reserved.
        </span>
        |
        <span>
          Designed by{" "}
          <a
            href="https://mipitech.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 font-semibold hover:underline"
          >
            MIPI TECH
          </a>
        </span>
      </div>
    </footer>
  );
}
