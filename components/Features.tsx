"use client";

import { motion } from "framer-motion";
import { Wifi, Tv, Lightbulb, Signal } from "lucide-react";
import Image from "next/image";

export default function Features() {
  const features = [
    {
      icon: <Wifi className="w-10 h-10 text-orange-500 mx-auto" />,
      title: "Data",
      desc: "Swiftly purchase Data for all networks @cheap rates with instant delivery.",
      btn: "Buy Now",
    },
    {
      icon: <Tv className="w-10 h-10 text-orange-500 mx-auto" />,
      title: "TV Subscription",
      desc: "Stay connected! Subscribe and Renew your TV subscription instantly.",
      btn: "Subscribe",
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-orange-500 mx-auto" />,
      title: "Electricity Bills",
      desc: "Purchase prepaid meter tokens instantly and Pay estimated bill.",
      btn: "Pay",
    },
    {
      icon: <Signal className="w-10 h-10 text-orange-500 mx-auto" />,
      title: "Airtime",
      desc: "Never run low on Airtime, purchase instantly for all networks.",
      btn: "Buy Now",
    },
  ];

  const products = [
    {
      img: "/waec result checker.jpg",
      title: "WAEC Result Checker",
      desc: "(Pin & Serial No.)",
      price: "₦3320",
    },
    {
      img: "/neco.webp",
      title: "NECO Result Checker",
      desc: "(Token)",
      price: "₦1170",
    },
    {
      img: "/nabteb.avif",
      title: "NABTEB Result Checker",
      desc: "(Pin & Serial No.)",
      price: "₦850",
    },
    {
      img: "/nbais.webp",
      title: "NBAIS Result Checker",
      desc: "(e-Pin)",
      price: "₦920",
    },
  ];

  return (
    <>
      {/* Features Section */}
      <section id="features" className="py-16 bg-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-orange-500 font-semibold uppercase tracking-wide text-sm sm:text-base">
            Features
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-2">
            Data, TV Subscription, Electricity Bills & Airtime
          </h2>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-10 lg:px-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {feature.icon}
              <h4 className="mt-3 text-base sm:text-lg font-semibold text-blue-900">
                {feature.title}
              </h4>
              <p className="mt-1 text-gray-600 text-xs sm:text-sm">
                {feature.desc}
              </p>
              <button className="mt-4 sm:mt-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-lg transition">
                {feature.btn}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Result Checker Section */}
      <section className="py-16 bg-gray-50 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-orange-500 font-semibold uppercase tracking-wide text-sm sm:text-base">
            E-Pins Products
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-2">
            Educational Result Checker Pins
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            You can purchase WAEC, NECO, NABTEB and NBAIS Result Checker Pins at
            Cheap Rates with Instant Delivery.
          </p>
          <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-10 lg:px-16">
          {products.map((product, index) => (
            <motion.div
              key={index}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Image
                src={product.img}
                alt={product.title}
                width={300}
                height={160}
                className="w-full h-40 object-contain mb-4 rounded-md"
              />
              <h4 className="text-base sm:text-lg font-semibold text-blue-900">
                {product.title}
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm">{product.desc}</p>
              <a href="/dashboard">
                <button className="mt-4 sm:mt-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 rounded-lg transition">
                  Buy Now @{product.price}
                </button>
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
