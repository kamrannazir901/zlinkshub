import React from "react";
import { ShieldCheck, Lock, Eye, Cookie } from "lucide-react";

const PrivacyPolicy = () => {
  const sectionClass = "mb-10";
  const h2Class =
    "text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2";
  const pClass = "text-gray-600 leading-relaxed mb-4";

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <header className="mb-12 border-b border-gray-100 pb-8">
          <div className="inline-flex items-center gap-2 text-[#d81159] font-bold text-sm uppercase tracking-widest mb-4">
            <Lock size={16} />
            <span>Compliance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Privacy <span className="text-[#d81159]">Policy</span>
          </h1>
          <p className="text-gray-400 font-medium">Last Updated: March 2026</p>
        </header>

        <div className={sectionClass}>
          <h2 className={h2Class}>
            <Eye size={24} className="text-[#d81159]" /> 1. Information We
            Collect
          </h2>
          <p className={pClass}>
            At ZLinksHub, we collect minimal data. This includes information you
            provide directly via our contact form (Name and Email) and automated
            data collected through cookies.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={h2Class}>
            <Cookie size={24} className="text-[#d81159]" /> 2. Cookies &
            Tracking
          </h2>
          <p className={pClass}>
            We use cookies to improve your experience and to track affiliate
            referrals. When you click on a product link, a cookie is placed to
            ensure ZLinksHub receives credit for the referral if you make a
            purchase. This is standard for Amazon Associates and does not cost
            you anything extra.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={h2Class}>
            <Lock size={24} className="text-[#d81159]" /> 3. Data Security
          </h2>
          <p className={pClass}>
            We prioritize the security of your information. We do not sell,
            trade, or otherwise transfer your personally identifiable
            information to outside parties. All data is handled according to
            modern encryption standards.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={h2Class}>
            <ShieldCheck size={24} className="text-[#d81159]" /> 4. Amazon
            Associates Disclosure
          </h2>
          <p className={pClass}>
            ZLinksHub is a participant in the Amazon Services LLC Associates
            Program, an affiliate advertising program designed to provide a
            means for sites to earn advertising fees by advertising and linking
            to Amazon.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
