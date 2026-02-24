import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white mt-auto">
      {/* Top Bar: Logo and Navigation */}
      <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-white text-gray-900 w-7 h-7 rounded flex items-center justify-center font-bold text-sm">
            Z
          </div>
          <span className="text-lg font-bold tracking-tight">LinksHub</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link to="/disclaimer" className="hover:text-white transition-colors">
            Affiliate Disclaimer
          </Link>
        </div>
      </div>

      {/* Bottom Bar: Clear White Disclaimer */}
      <div className="px-6 py-10">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-white text-sm leading-relaxed mb-4">
            As an Amazon Associate, we earn a small commission from qualifying
            purchases at no extra cost to you. We only recommend products we
            trust to help you shop smarter.
          </p>

          <div className="h-px w-12 bg-primary mx-auto mb-4"></div>

          <p className="text-white text-[10px] uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} ZLinksHub • All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
