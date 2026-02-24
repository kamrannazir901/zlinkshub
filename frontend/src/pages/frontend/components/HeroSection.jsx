import React from "react";
import { ArrowRight, ShoppingBag, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative w-full md:py-20 py-10 bg-white overflow-hidden">
      {/* Decorative subtle gradient - just to prevent it looking "flat" */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Minimal Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-500 text-[11px] uppercase tracking-[0.15em] font-bold mb-10">
            <CheckCircle2 size={14} className="text-primary" />
            Best Recommendations
          </div>

          {/* Clean, Massive Typography */}
          <h1 className="text-5xl md:text-8xl font-black text-gray-900 leading-[0.95] mb-8 tracking-tighter">
            Smart Shopping <br />
            <span className="text-primary">Starts Here.</span>
          </h1>

          {/* Decent Short Description */}
          <p className="text-gray-500 text-lg md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Discover handpicked Amazon products with real value. We do the
            research, you get the best deals.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <Link
              to="/products"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all hover:shadow-2xl active:scale-95"
            >
              <ShoppingBag size={20} />
              Explore Products
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all"
            >
              How it works
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
