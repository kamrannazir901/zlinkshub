import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Users,
  Key,
  Tag,
  Globe,
  BookOpen,
  BarChart,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  const adminLinks = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} strokeWidth={2} />,
    },
    {
      to: "/admin/users",
      label: "Users",
      icon: <Users size={18} strokeWidth={2} />,
    },
    {
      to: "/admin/api-accounts",
      label: "API Accounts",
      icon: <Key size={18} strokeWidth={2} />,
    },
    {
      to: "/admin/tracking-tags",
      label: "Tracking Tags",
      icon: <Tag size={18} strokeWidth={2} />,
    },
    {
      to: "/admin/reports",
      label: "Reports",
      icon: <BarChart size={18} strokeWidth={2} />,
    },
    // Guides moved to the end of the list
    {
      to: "/admin/guides",
      label: "Guides",
      icon: <BookOpen size={18} strokeWidth={2} />,
    },
  ];

  const linkClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-[14px] font-medium";
  const activeClass =
    "bg-white/10 text-white border border-white/10 shadow-sm font-semibold";
  const inactiveClass = "text-gray-400 hover:text-white hover:bg-white/5";

  return (
    <nav className="bg-gray-900 text-white w-full h-16 fixed top-0 left-0 z-50 px-4 md:px-6 flex items-center justify-between border-b border-gray-800">
      {/* Brand / Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/admin/dashboard")}
      >
        <div className="bg-[#d81159] text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
          <span className="font-bold text-lg">Z</span>
        </div>
        <span className="text-xl font-bold tracking-tight">
          LinksHub{" "}
          <span className="text-gray-500 font-medium text-[14px] ml-1">
            Admin
          </span>
        </span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1 lg:gap-2">
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}

        <div className="h-5 w-px bg-gray-700 mx-3"></div>

        <div className="flex items-center gap-1">
          <a
            href="https://zlinkshub.com"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            title="View Live Site"
          >
            <Globe size={20} strokeWidth={1.5} />
          </a>

          <button
            onClick={handleLogout}
            className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={20} strokeWidth={1.5} />
          </button>
        </div>
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
        className={`fixed top-16 left-0 w-full bg-gray-900 border-b border-gray-800 p-5 flex flex-col gap-3 transition-all duration-300 md:hidden z-40 shadow-2xl ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl text-[15px] ${
                isActive
                  ? "bg-white/10 text-white font-semibold"
                  : "text-gray-400"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}

        <div className="h-px bg-gray-800 w-full my-1"></div>

        <div className="flex justify-between items-center px-2 py-2">
          <a
            href="https://zlinkshub.com"
            className="text-[15px] flex items-center gap-2 text-gray-300 font-medium"
          >
            <Globe size={18} /> Live Site
          </a>
          <button
            onClick={handleLogout}
            className="text-[15px] flex items-center gap-2 text-red-400 font-semibold"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
