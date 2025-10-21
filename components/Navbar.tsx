"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const links = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "FAQ", href: "#faq" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact Us", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const sections = links.map((link) => document.querySelector(link.href));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.5 }
    );
    sections.forEach((sec) => sec && observer.observe(sec));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((sec) => sec && observer.unobserve(sec));
    };
  }, []);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);

    // Scroll smoothly to section
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      // If on another page, navigate to home with hash
      window.location.href = `/${href}`;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 transition-all duration-300
        ${
          scrolled ? "backdrop-blur-md bg-black/60 py-3" : "bg-transparent py-6"
        }
      `}
    >
      {/* Brand */}
      <div
        className={`${
          scrolled ? "text-xl" : "text-2xl"
        } font-bold text-orange-500`}
      >
        Tap<span className="text-white">Am</span>
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-6 font-medium transition-colors duration-300">
        {links.map((link) => (
          <li key={link.name} className="hover:text-orange-400 cursor-pointer">
            <a
              href={`/${link.href}`}
              className={
                activeSection === link.href.slice(1)
                  ? "text-orange-500 font-semibold"
                  : "text-white"
              }
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop Login/Register */}
      <div className="hidden md:flex gap-3">
        <a
          href="/login"
          className="px-5 py-2 rounded-full border border-white/20 text-white hover:bg-orange-500/70 transition text-sm"
        >
          Login
        </a>
        <a
          href="/register"
          className="px-5 py-2 rounded-full border border-orange-400/30 text-white bg-orange-500/80 hover:bg-orange-600/80 transition text-sm"
        >
          Register
        </a>
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setIsOpen(true)} className="md:hidden text-white">
        <Menu size={24} />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 bg-black z-50 flex flex-col px-6 py-10 overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="self-end text-white"
            >
              <X size={28} />
            </button>

            {/* Mobile Links */}
            <ul className="flex flex-col mt-10 text-white text-lg">
              {links.map((link, index) => (
                <li key={link.name} className="cursor-pointer">
                  <a
                    onClick={() => handleLinkClick(link.href)}
                    className={
                      activeSection === link.href.slice(1)
                        ? "text-orange-500 font-semibold block py-3"
                        : "block py-3"
                    }
                  >
                    {link.name}
                  </a>
                  {/* Divider line */}
                  {index < links.length - 1 && (
                    <hr className="border-gray-700" />
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Login/Register */}
            <div className="flex flex-row gap-4 mt-10">
              <a
                href="/login"
                className="flex-1 px-5 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition text-center"
              >
                Login
              </a>
              <a
                href="/register"
                className="flex-1 px-5 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition text-center"
              >
                Register
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
