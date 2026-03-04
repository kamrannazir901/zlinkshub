import React from "react";
import { FileText, Scale, AlertTriangle, HelpCircle } from "lucide-react";

const TermsOfService = () => {
  const sectionClass = "mb-10";
  const h2Class =
    "text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2";
  const pClass = "text-gray-600 leading-relaxed mb-4";

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <header className="mb-12 border-b border-gray-100 pb-8">
          <div className="inline-flex items-center gap-2 text-[#d81159] font-bold text-sm uppercase tracking-widest mb-4">
            <Scale size={16} />
            <span>Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Terms of <span className="text-[#d81159]">Service</span>
          </h1>
          <p className="text-gray-400 font-medium">
            Effective Date: March 2026
          </p>
        </header>

        <div className={sectionClass}>
          <h2 className={h2Class}>
            <Scale size={24} className="text-[#d81159]" /> 1. Agreement to Terms
          </h2>
          <p className={pClass}>
            By accessing ZLinksHub, you agree to be bound by these terms. If you
            do not agree to all of the terms and conditions stated on this page,
            please do not continue to use ZLinksHub.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={h2Class}>
            <AlertTriangle size={24} className="text-[#d81159]" /> 2. Content
            Disclaimer
          </h2>
          <p className={pClass}>
            The content on ZLinksHub is for informational purposes only. While
            we strive for accuracy, we are not responsible for pricing changes,
            out-of-stock items, or errors on external merchant sites (like
            Amazon). All product warranties are provided by the manufacturers.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={h2Class}>
            <FileText size={24} className="text-[#d81159]" /> 3. Intellectual
            Property
          </h2>
          <p className={pClass}>
            Unless otherwise stated, ZLinksHub and/or its licensors own the
            intellectual property rights for all material on this website. All
            intellectual property rights are reserved.
          </p>
        </div>

        <div className={sectionClass}>
          <h2 className={h2Class}>
            <HelpCircle size={24} className="text-[#d81159]" /> 4. Limitation of
            Liability
          </h2>
          <p className={pClass}>
            ZLinksHub shall not be liable for any damages resulting from your
            use of the products we recommend. Your relationship for any product
            purchase is strictly between you and the third-party merchant.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
