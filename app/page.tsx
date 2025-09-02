"use client";

import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import About from "@/components/About";
import FAQ from "@/components/Faqsection";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="relative overflow-y-auto scroll-smooth">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex flex-col items-start justify-center px-6 sm:px-10 py-20 min-h-screen text-white"
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/home-bg.jpg')] bg-cover bg-center -z-20"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 -z-10"></div>

        {/* Welcome Text */}
        <motion.p
          className="text-base sm:text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome To TapAm!
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug mt-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          DATA, TV <br />
          SUBSCRIPTION, <br />
          ELECTRICITY BILLS, <br />
          EXAMS/RESULT <br />
          CHECKER PINS!!
        </motion.h1>

        {/* Motto */}
        <motion.p
          className="mt-4 text-orange-400 font-semibold text-sm sm:text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          All Your Bills, One Tap Away.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <a href="/login">
            {" "}
            <button className="flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 rounded-full backdrop-blur-md bg-white/20 text-white border border-white/20 hover:bg-orange-500/70 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
              <LogIn size={18} /> Login
            </button>
          </a>

          <a href="/register">
            <button className="flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 rounded-full backdrop-blur-md bg-orange-500/80 text-white border border-orange-400/30 hover:bg-orange-600/80 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
              <UserPlus size={18} /> Register
            </button>{" "}
          </a>
        </motion.div>
      </section>

      {/* Features Section */}
      <Features />

      {/*About US */}
      <About />

      {/*faq */}
      <FAQ />

      {/*Contact Us */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
}
