import React from "react";

interface Plan {
  name: string;
  price: string;
  duration?: string;
}

interface Category {
  title: string;
  plans: Plan[];
  buttonText?: string;
}

const categories: Category[] = [
  {
    title: "MTN SME Data ",
    plans: [
      { name: "500MB (SME)", price: "₦485", duration: "7days" },
      { name: "1GB (SME)", price: "₦776", duration: "7days" },
      { name: "1.5GB (SME)", price: "₦970", duration: "7days" },
      { name: "2GB (SME)", price: "₦1455", duration: "30days" },
      { name: "3.5GB (SME)", price: "₦2425", duration: "30days" },
      { name: "6GB (SME)", price: "₦2425", duration: "7days" },
      { name: "7GB (SME)", price: "₦3395", duration: "30days" },
      { name: "10GB (SME)", price: "₦4365", duration: "30days" },
    ],
  },
  {
    title: "MTN CG Lite Data (SME 2.0) ",
    plans: [
      { name: "50MB (CG_LITE)", price: "₦19", duration: "30days" },
      { name: "150MB (CG_LITE)", price: "₦79", duration: "30days" },
      { name: "250MB (CG_LITE)", price: "₦94", duration: "30days" },
      { name: "500MB (CG_LITE)", price: "₦109", duration: "30days" },
      { name: "1GB (CG_LITE)", price: "₦219", duration: "30days" },
      { name: "2GB (CG_LITE)", price: "₦438", duration: "30days" },
      { name: "3GB (CG_LITE)", price: "₦658", duration: "30days" },
      { name: "5GB (CG_LITE)", price: "₦1097", duration: "30days" },
      { name: "10GB (CG_LITE)", price: "₦2194", duration: "30days" },
    ],
  },
  {
    title: "MTN CG Data ",
    plans: [
      { name: "500MB (CG)", price: "₦360", duration: "7days" },
      { name: "1GB (CG)", price: "₦500", duration: "7days" },
      { name: "2GB (CG)", price: "₦1000", duration: "7days" },
      { name: "3GB (CG)", price: "₦1500", duration: "7days" },
      { name: "5GB (CG)", price: "₦2400", duration: "30days" },
    ],
  },
  {
    title: "AIRTEL Corporate Gifting ",
    plans: [
      { name: "500MB (CG)", price: "₦487", duration: "7days" },
      { name: "1GB (CG)", price: "₦780", duration: "7days" },
      { name: "1.5GB (CG)", price: "₦975", duration: "7days" },
      { name: "2GB (CG)", price: "₦1462", duration: "30days" },
      { name: "3GB (CG)", price: "₦1950", duration: "30days" },
      { name: "3.5GB (CG)", price: "₦1462", duration: "7days" },
      { name: "4GB (CG)", price: "₦2437", duration: "30days" },
      { name: "6GB (CG)", price: "₦2437", duration: "7days" },
      { name: "8GB (CG)", price: "₦2925", duration: "30days" },
      { name: "10GB (CG)", price: "₦3900", duration: "30days" },
      { name: "13GB (CG)", price: "₦4875", duration: "30days" },
      { name: "25GB (CG)", price: "₦7800", duration: "30days" },
    ],
  },
  {
    title: "MTN Direct Gifting ",
    plans: [
      { name: "1GB (Awoof)", price: "₦485", duration: "1day" },
      { name: "3.2GB (Awoof)", price: "₦970", duration: "2days" },
      { name: "11GB (Awoof)", price: "₦3395", duration: "7days" },
      { name: "1GB (Direct)", price: "₦776", duration: "7days" },
      { name: "2GB (Direct)", price: "₦1455", duration: "30days" },
      { name: "7GB (Direct)", price: "₦3395", duration: "30days" },
      { name: "10GB (Direct)", price: "₦4365", duration: "30days" },
    ],
  },
  {
    title: "GLO Corporate Gifting Data ",
    plans: [
      { name: "200MB (CG)", price: "₦83", duration: "14days" },
      { name: "500MB (CG)", price: "₦198", duration: "30days" },
      { name: "1GB (CG)", price: "₦395", duration: "30days" },
      { name: "3GB (CG)", price: "₦1185", duration: "30days" },
      { name: "5GB (CG)", price: "₦1975", duration: "30days" },
      { name: "10GB (CG)", price: "₦3950", duration: "30days" },
    ],
  },
  {
    title: "9mobile SME Data ",
    plans: [
      { name: "500MB (SME)", price: "₦180", duration: "30days" },
      { name: "1GB (SME)", price: "₦360", duration: "30days" },
      { name: "2GB (SME)", price: "₦720", duration: "30days" },
      { name: "10GB (SME)", price: "₦3600", duration: "30days" },
    ],
  },
  {
    title: "Airtel Direct Gifting ",
    plans: [
      { name: "150MB (Awoof)", price: "₦55", duration: "1day" },
      { name: "600MB (Awoof)", price: "₦202", duration: "2days" },
      { name: "1.5GB (Awoof)", price: "₦395", duration: "1day" },
      { name: "2GB (Direct)", price: "₦1462", duration: "30days" },
      { name: "13GB (Direct)", price: "₦4875", duration: "30days" },
      { name: "25GB (Direct)", price: "₦7800", duration: "30days" },
    ],
  },
  {
    title: "Glo Direct Gifting Data ",
    plans: [
      { name: "750MB (Awoof)", price: "₦195", duration: "1day" },
      { name: "2.5GB (Awoof)", price: "₦487", duration: "2days" },
      { name: "10GB (Awoof)", price: "₦1950", duration: "7days" },
      { name: "5GB (Direct)", price: "₦1417", duration: "30days" },
      { name: "28GB (Direct)", price: "₦7562", duration: "30days" },
    ],
  },
  {
    title: "9mobile Direct Gifting Data ",
    plans: [
      { name: "500MB (Direct)", price: "₦415", duration: "30days" },
      { name: "1.5GB (Direct)", price: "₦831", duration: "30days" },
      { name: "4.5GB (Direct)", price: "₦1663", duration: "30days" },
      { name: "15GB (Direct)", price: "₦4158", duration: "30days" },
      { name: "75GB (Direct)", price: "₦12474", duration: "30days" },
    ],
  },
  {
    title: "MTN DATACARD ",
    plans: [
      { name: "1GB (DATACARD)", price: "₦2130", duration: "7days" },
      { name: "1.5GB (DATACARD)", price: "₦3200", duration: "30days" },
      { name: "10GB (DATACARD)", price: "₦19816", duration: "30days" },
    ],
  },
  {
    title: "API Result Checker Pins",
    plans: [
      { name: "WAEC", price: "₦3300" },
      { name: "NECO", price: "₦1150" },
      { name: "NABTEB", price: "₦830" },
      { name: "NBAIS", price: "₦900" },
    ],
  },
  {
    title: "API TV / Electricity",
    plans: [
      {
        name: "TV Subscription",
        price: "1% Discount — ₦0 Convenience Fee",
      },
      {
        name: "Electricity Bill",
        price: "0.3% Discount — ₦0 Convenience Fee",
      },
    ],
    buttonText: "Pay Now",
  },
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-12 bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-orange-500 font-semibold uppercase tracking-wide text-sm sm:text-base">
          Pricing
        </h3>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mt-2">
          Check Our Prices Below
        </h2>
        <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-6 border hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-center text-blue-900 mb-4">
                {cat.title}
              </h3>

              <ul className="space-y-2 text-sm text-gray-700 max-h-72 overflow-y-auto border-t border-b py-3">
                {cat.plans.map((plan, i) => (
                  <li key={i} className="flex justify-between border-b pb-1">
                    <span>{plan.name}</span>
                    <span className="font-medium">{plan.price}</span>
                    {plan.duration && (
                      <span className="text-gray-500 ml-2">
                        ({plan.duration})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <a href="/login">
                <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition">
                  {cat.buttonText || "Buy Now"}
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
