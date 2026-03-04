import React from "react";
import { ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative w-full pt-16 pb-8 md:pt-24 md:pb-16 bg-white overflow-hidden font-sans">
      {/* Subtle Brand Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#d81159]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Minimal Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-500 text-[11px] uppercase tracking-wider font-semibold mb-6">
            <ShieldCheck size={14} className="text-[#d81159]" />
            Independent Product Research
          </div>

          {/* Typography - Toned down from black to bold */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
            Smart Shopping <br />
            <span className="text-[#d81159]">With ZLinksHub.</span>
          </h1>

          {/* Medium weight description for a cleaner look */}
          <p className="text-gray-500 text-base md:text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
            We analyze thousands of data points to bring you the best Amazon
            deals. No fluff, just gear that actually delivers value to your
            life.
          </p>

          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 items-center mb-12">
            <Link
              to="/products"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all active:scale-95 text-sm"
            >
              <ShoppingBag size={18} />
              Explore Products
            </Link>

            <Link
              to="/guides"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
            >
              Read Guides
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Refined Social Proof Bar */}
          <div className="pt-8 border-t border-gray-100 flex justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">1k+</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                Handpicked
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">24/7</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                Price Tracking
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">Verified</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                Reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
