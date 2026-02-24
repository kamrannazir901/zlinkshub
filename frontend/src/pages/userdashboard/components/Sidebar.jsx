import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Link as LinkIcon, Globe } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  // User-specific links
  const userLinks = [
    {
      to: "/dashboard",
      label: "Get Link",
      icon: <LinkIcon size={18} strokeWidth={2} />,
    },
  ];

  const linkClass =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium";
  const activeClass = "bg-white/10 text-white border border-white/20 shadow-sm";
  const inactiveClass = "text-gray-400 hover:text-white hover:bg-white/5";

  return (
    <nav className="bg-gray-900 text-white w-full h-16 fixed top-0 left-0 z-50 px-6 flex items-center justify-between border-b border-gray-800">
      {/* Brand / Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <div className="bg-white text-gray-900 w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
          <span className="font-bold text-xl">Z</span>
        </div>
        <span className="text-xl font-bold tracking-tight hidden sm:block">
          LinksHub{" "}
          <span className="text-gray-500 font-medium text-sm ml-1">
            Creator
          </span>
        </span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2">
        {userLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end // Ensures "/" doesn't match everything
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-gray-700 mx-3"></div>

        {/* Actions Section */}
        <div className="flex items-center gap-1">
          {/* Live Site Button */}
          <a
            href="https://zlinkshub.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors group"
            title="View Live Site"
          >
            <Globe
              size={20}
              strokeWidth={1.5}
              className="opacity-80 group-hover:opacity-100"
            />
          </a>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-white hover:bg-red-500/20 rounded-lg transition-colors group"
            title="Logout"
          >
            <LogOut
              size={20}
              strokeWidth={1.5}
              className="opacity-80 group-hover:opacity-100 group-hover:text-red-400"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Icon */}
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
        {userLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeMenu}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
        <hr className="border-gray-800" />
        <div className="flex justify-between items-center px-4">
          <a
            href="https://zlinkshub.com"
            className="text-sm flex items-center gap-2 text-white"
          >
            <Globe size={18} /> Live Site
          </a>
          <button
            onClick={handleLogout}
            className="text-sm flex items-center gap-2 text-red-400 font-semibold"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
