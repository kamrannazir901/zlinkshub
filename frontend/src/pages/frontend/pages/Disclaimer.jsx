import React from "react";
import {
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Scale,
  Info,
} from "lucide-react";

const Disclaimer = () => {
  const sectionClass = "group";
  const h2Class =
    "text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 group-hover:text-[#d81159] transition-colors";
  const pClass = "text-gray-600 text-[15px] leading-relaxed font-medium";

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#d81159] font-bold text-sm uppercase tracking-[0.2em] mb-4">
            <Scale size={18} />
            <span>Transparency Report</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
            Affiliate <span className="text-[#d81159]">Disclaimer</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Honesty is the foundation of ZLinksHub. Here is how we handle links,
            commissions, and your data.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border border-gray-100 rounded-[48px] p-8 md:p-16 shadow-2xl shadow-gray-100/50 relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16"></div>

          <div className="space-y-12 relative z-10">
            {/* Introduction Row */}
            <div className="flex gap-5 items-start bg-[#d81159]/5 p-6 rounded-3xl border border-[#d81159]/10">
              <ShieldCheck className="text-[#d81159] shrink-0 mt-1" size={28} />
              <p className="text-gray-700 text-base leading-relaxed font-semibold">
                ZLinksHub is a participant in the Amazon Services LLC Associates
                Program. This means we may earn a commission from purchases made
                through our curated links—at zero extra cost to you.
              </p>
            </div>

            {/* Grid for Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Section 1 */}
              <section className={sectionClass}>
                <h2 className={h2Class}>
                  <Info size={20} /> Affiliate Links
                </h2>
                <p className={pClass}>
                  When you click a link and buy a product, we receive a small
                  percentage of the sale.
                  <strong>
                    {" "}
                    This never influences our price or your cost.
                  </strong>{" "}
                  This revenue allows us to keep the hub running and free of
                  intrusive ads.
                </p>
              </section>

              {/* Section 2 */}
              <section className={sectionClass}>
                <h2 className={h2Class}>
                  <Scale size={20} /> Information Accuracy
                </h2>
                <p className={pClass}>
                  Amazon prices and stock levels fluctuate by the minute. While
                  we check our data frequently, we cannot guarantee that the
                  price shown here will match the final checkout price on the
                  merchant's site.
                </p>
              </section>

              {/* Section 3 */}
              <section className={sectionClass}>
                <h2 className={h2Class}>
                  <ShieldCheck size={20} /> Editorial Integrity
                </h2>
                <p className={pClass}>
                  Our product selections are based on research, performance, and
                  value. We do not accept payments for positive reviews or
                  "ranked" positions in our guides. The user's benefit always
                  comes first.
                </p>
              </section>

              {/* Section 4 */}
              <section className={sectionClass}>
                <h2 className={h2Class}>
                  <ExternalLink size={20} /> External Practices
                </h2>
                <p className={pClass}>
                  Once you leave ZLinksHub for Amazon or any other retailer,
                  their privacy policies and terms apply. We are not responsible
                  for the business practices or content of these external
                  platforms.
                </p>
              </section>
            </div>

            {/* Bottom Warning */}
            <div className="bg-gray-900 rounded-[32px] p-8 text-white flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-[#d81159] p-3 rounded-2xl shrink-0">
                <AlertCircle size={24} />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed text-center md:text-left">
                <strong>Liability Notice:</strong> ZLinksHub will not be held
                liable for any damages or losses resulting from the use of this
                website or products purchased via our links. Purchases are made
                at your own discretion.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Footer Date */}
        <div className="mt-12 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
          Last Verified:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
