import Link from "next/link";

export default function Pricing() {
  const firstSectionTitles = [
    "MTN SME Data (API)",
    "MTN CG Lite Data (SME 2.0)",
    "MTN CG Data (API)",
    "AIRTEL Corporate Gifting (API)",
  ];

  return (
    <div className="bg-gray-100 py-10">
      {/* ===== Pricing Section 1 ===== */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 mb-10">
        {firstSectionTitles.map((title, index) => (
          <div key={index} className="bg-white shadow-lg p-5 rounded-md">
            <h2 className="text-center font-bold text-orange-600 mb-3">
              {title}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>500MB - N485 (7 days)</li>
              <li>1GB - N776 (7 days)</li>
              <li>2GB - N1455 (30 days)</li>
              <li>3GB - N1950 (30 days)</li>
            </ul>
            <Link
              href="/dashboard"
              className="block mt-4 text-center bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
            >
              Buy Now
            </Link>
          </div>
        ))}
      </section>

      {/* ===== Pricing Section 2 ===== */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="bg-white shadow-lg p-5 rounded-md">
            <h2 className="text-center font-bold text-orange-600 mb-3">
              Same Pricing Box {num}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>500MB - N485 (7 days)</li>
              <li>1GB - N776 (7 days)</li>
              <li>2GB - N1455 (30 days)</li>
              <li>3GB - N1950 (30 days)</li>
            </ul>
            <Link
              href="/dashboard"
              className="block mt-4 text-center bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
            >
              Buy Now
            </Link>
          </div>
        ))}
      </section>

      {/* ===== Pricing Section 3 ===== */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="bg-white shadow-lg p-5 rounded-md">
            <h2 className="text-center font-bold text-orange-600 mb-3">
              Same Pricing Box {num}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>500MB - N485 (7 days)</li>
              <li>1GB - N776 (7 days)</li>
              <li>2GB - N1455 (30 days)</li>
              <li>3GB - N1950 (30 days)</li>
            </ul>
            <Link
              href="/dashboard"
              className="block mt-4 text-center bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
            >
              Buy Now
            </Link>
          </div>
        ))}
      </section>

      {/* ===== Pricing Section 4 ===== */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="bg-white shadow-lg p-5 rounded-md">
            <h2 className="text-center font-bold text-orange-600 mb-3">
              Same Pricing Box {num}
            </h2>
            <ul className="space-y-2 text-sm">
              <li>500MB - N485 (7 days)</li>
              <li>1GB - N776 (7 days)</li>
              <li>2GB - N1455 (30 days)</li>
              <li>3GB - N1950 (30 days)</li>
            </ul>
            <Link
              href="/dashboard"
              className="block mt-4 text-center bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
            >
              Buy Now
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
