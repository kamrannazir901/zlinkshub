import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white mt-auto">
      {/* Top Bar: Logo and Navigation */}
      <div className="px-4 md:px-6 flex flex-col md:flex-row items-center justify-between border-b border-white/10 py-8 md:h-24 gap-6">
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#d81159] text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base shadow-lg shadow-[#d81159]/20">
            Z
          </div>
          <span className="text-xl font-bold tracking-tight">LinksHub</span>
        </div>

        {/* Navigation Row */}
        <nav className="flex flex-wrap justify-center items-center gap-x-6 lg:gap-x-8 gap-y-4 text-[14px] font-medium text-gray-400">
          <Link to="/home" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/products" className="hover:text-white transition-colors">
            Products
          </Link>
          <Link to="/guides" className="hover:text-white transition-colors">
            Guides
          </Link>
          <Link to="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link
            to="/disclaimer"
            className="hover:text-[#d81159] transition-colors"
          >
            Affiliate Disclaimer
          </Link>
        </nav>
      </div>

      {/* Bottom Content: Trust & Legal */}
      <div className="px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Replaced Mission Statement with Associate Disclaimer */}
          <p className="text-gray-400 text-[14px] leading-relaxed mb-8 italic">
            As an Amazon Associate,{" "}
            <span className="text-white font-medium">ZLinksHub</span> earns from
            qualifying purchases. This means we may receive a small commission
            at no additional cost to you when you click on our links and make a
            purchase.
          </p>

          {/* Brand Accent Separator */}
          <div className="h-[2px] w-12 bg-[#d81159] mx-auto mb-8 rounded-full"></div>

          {/* Legal Links & Copyright */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[13px] text-gray-300 font-medium">
              <Link
                to="/privacy-policy"
                className="hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                to="/terms"
                className="hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </Link>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-gray-400 text-[12px] font-medium tracking-wide uppercase">
              <span>© {new Date().getFullYear()} ZLinksHub</span>
              <span className="hidden md:inline">&bull;</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
