import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  Mail,
  Home as HomeIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const closeMenu = () => setIsOpen(false);

  // Helper to determine where the "Dashboard" button should go
  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  const linkClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium";
  const inactiveClass = "text-gray-400 hover:text-white hover:bg-white/5";

  return (
    <nav className="bg-gray-900 text-white w-full h-16 fixed top-0 left-0 z-50 px-6 flex items-center justify-between border-b border-gray-800">
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer">
        <div className="bg-white text-gray-900 w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
          <span className="font-bold text-xl">Z</span>
        </div>
        <span className="text-xl font-bold tracking-tight">LinksHub</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-2">
        <Link to="/" className={`${linkClass} ${inactiveClass}`}>
          <HomeIcon size={18} strokeWidth={1.5} />
          Home
        </Link>

        <Link to="/contact" className={`${linkClass} ${inactiveClass}`}>
          <Mail size={18} strokeWidth={1.5} />
          Contact
        </Link>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gray-700 mx-3"></div>

        {user ? (
          <Link
            to={dashboardPath}
            className="flex items-center gap-2 px-5 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-200 transition-all font-bold text-sm shadow-lg"
          >
            <LayoutDashboard size={18} strokeWidth={2} />
            Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-200 transition-all font-bold text-sm shadow-lg"
          >
            <LogIn size={18} strokeWidth={2} />
            Login
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden p-2 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X size={28} strokeWidth={1.5} />
        ) : (
          <Menu size={28} strokeWidth={1.5} />
        )}
      </button>

      {/* Mobile Slide-down Menu */}
      <div
        className={`fixed top-16 left-0 w-full bg-gray-900 border-b border-gray-800 p-6 flex flex-col gap-4 transition-all duration-300 md:hidden z-40 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <Link
          to="/"
          onClick={closeMenu}
          className={`${linkClass} ${inactiveClass}`}
        >
          <HomeIcon size={18} /> Home
        </Link>
        <Link
          to="/contact"
          onClick={closeMenu}
          className={`${linkClass} ${inactiveClass}`}
        >
          <Mail size={18} /> Contact
        </Link>

        <hr className="border-gray-800" />

        {user ? (
          <Link
            to={dashboardPath}
            onClick={closeMenu}
            className="flex justify-center items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-bold"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            onClick={closeMenu}
            className="flex justify-center items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-bold"
          >
            <LogIn size={18} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
