"use client";

import { motion } from "framer-motion";
import { Users, Target, Shield, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
            <a href="https://www.mipitech.com.ng">
              <span className="font-semibold text-orange-500">MIPI TECH</span>
            </a>
            , focused on giving you secure, user-friendly, and reliable
            experiences.
          </p>
        </motion.div>
      </div>

      {/* Testimonials Carousel */}
      <div className="max-w-6xl mx-auto mt-20 text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-orange-500 font-semibold uppercase tracking-wide text-sm sm:text-base">
            Testimonial
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-2">
            What Our Customers Say
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
        </motion.div>

        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="mt-12"
        >
          {/* Testimonial 1 */}
          <SwiperSlide>
            <div className="bg-gray-50 p-8 rounded-2xl shadow-md max-w-xl mx-auto">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-600 italic">
                “TapAm makes paying for data and electricity so easy. I save
                time and stress every day!”
              </p>
              <h4 className="mt-4 font-semibold text-gray-900">— Adebayo S.</h4>
            </div>
          </SwiperSlide>

          {/* Testimonial 2 */}
          <SwiperSlide>
            <div className="bg-gray-50 p-8 rounded-2xl shadow-md max-w-xl mx-auto">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-600 italic">
                “Reliable, fast, and affordable. TapAm has become my go-to app
                for all bills.”
              </p>
              <h4 className="mt-4 font-semibold text-gray-900">
                — Chinenye K.
              </h4>
            </div>
          </SwiperSlide>

          {/* Testimonial 3 */}
          <SwiperSlide>
            <div className="bg-gray-50 p-8 rounded-2xl shadow-md max-w-xl mx-auto">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <p className="text-gray-600 italic">
                “I love the smooth experience. TapAm is secure and trustworthy —
                highly recommend!”
              </p>
              <h4 className="mt-4 font-semibold text-gray-900">— Musa A.</h4>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* CTA Section */}
      <div
        className="relative w-full bg-fixed bg-center bg-cover py-24 mt-20"
        style={{ backgroundImage: "url('/cta-bg.jpg')" }} // 👈 replace with your image path
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        <motion.div
          className="relative max-w-4xl mx-auto text-center px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Ready to Experience Seamless Payments?
          </h2>
          <p className="mt-4 text-lg text-gray-200">
            Join thousands of Nigerians already enjoying fast, secure, and
            reliable transactions.
          </p>
          <a
            href="/login"
            className="inline-block mt-8 px-10 py-4 bg-orange-500 text-white font-semibold rounded-full shadow-lg hover:bg-orange-600 transition duration-300"
          >
            Get Started
          </a>
        </motion.div>
      </div>
    </section>
  );
}
