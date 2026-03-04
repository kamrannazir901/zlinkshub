import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  Home as HomeIcon,
  ShoppingBag,
  BookOpen,
  Info,
  Mail,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

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

  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  // Shared classes for desktop links
  const linkClass =
    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-[14px] font-medium";
  const inactiveClass = "text-gray-400 hover:text-white hover:bg-white/5";
  const activeClass = "text-white bg-white/10";

  return (
    <nav className="bg-gray-900 text-white w-full h-16 fixed top-0 left-0 z-50 px-4 md:px-6 flex items-center justify-between border-b border-gray-800">
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center gap-3 cursor-pointer shrink-0">
        <div className="bg-[#d81159] text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
          <span className="font-bold text-lg">Z</span>
        </div>
        <span className="text-xl font-bold tracking-tight">LinksHub</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-1">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/guides"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Guides
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Contact
        </NavLink>

        {/* Vertical Divider */}
        <div className="h-5 w-px bg-gray-700 mx-3"></div>

        {user ? (
          <Link
            to={dashboardPath}
            className="flex items-center gap-2 px-5 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-semibold text-[14px]"
          >
            <LayoutDashboard size={17} strokeWidth={2.5} />
            Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-semibold text-[14px]"
          >
            <LogIn size={17} strokeWidth={2.5} />
            Login
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden p-2 text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Slide-down Menu */}
      <div
        className={`fixed top-16 left-0 w-full bg-gray-900 border-b border-gray-800 p-5 flex flex-col gap-2 transition-all duration-300 md:hidden z-40 shadow-2xl ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <Link
          to="/home"
          onClick={closeMenu}
          className="flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-white/5 font-medium text-[15px]"
        >
          <HomeIcon size={20} className="text-gray-500" /> Home
        </Link>

        <Link
          to="/products"
          onClick={closeMenu}
          className="flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-white/5 font-medium text-[15px]"
        >
          <ShoppingBag size={20} className="text-gray-500" /> Products
        </Link>

        <Link
          to="/guides"
          onClick={closeMenu}
          className="flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-white/5 font-medium text-[15px]"
        >
          <BookOpen size={20} className="text-gray-500" /> Guides
        </Link>

        <Link
          to="/about"
          onClick={closeMenu}
          className="flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-white/5 font-medium text-[15px]"
        >
          <Info size={20} className="text-gray-500" /> About
        </Link>

        <Link
          to="/contact"
          onClick={closeMenu}
          className="flex items-center gap-3 p-3 rounded-xl text-gray-300 hover:bg-white/5 font-medium text-[15px]"
        >
          <Mail size={20} className="text-gray-500" /> Contact
        </Link>

        <div className="h-px bg-gray-800 w-full my-2"></div>

        {user ? (
          <Link
            to={dashboardPath}
            onClick={closeMenu}
            className="flex justify-center items-center gap-2 px-6 py-4 bg-white text-gray-900 rounded-xl font-semibold text-[15px]"
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            onClick={closeMenu}
            className="flex justify-center items-center gap-2 px-6 py-4 bg-white text-gray-900 rounded-xl font-semibold text-[15px]"
          >
            <LogIn size={20} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
