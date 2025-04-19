import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./searchBar";
import Theme from "./theme";
import { ShoppingBag, ChevronDown, Menu } from "lucide-react";
import { useCart } from "../context/CartContent";
import { motion } from "framer-motion";

const Navbar = ({ setSearchQuery }) => {
  const { cart } = useCart();
  const [sticky, setSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ fullname: "", avatar: "", role: "" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      const fullname = localStorage.getItem("fullname");
      const avatar = localStorage.getItem("avatar");
      const role = localStorage.getItem("role"); // Get role from localStorage
      setUser({ fullname, avatar, role });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      requestAnimationFrame(() => {
        if (
          userDropdownRef.current &&
          !userDropdownRef.current.contains(e.target)
        ) {
          setShowDropdown(false);
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/login");
  };

  const handleDiscoverClick = () => {
    localStorage.getItem("accessToken")
      ? navigate("/discover")
      : navigate("/login");
  };

  const navitems = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <span onClick={handleDiscoverClick} className="cursor-pointer">
          Discover
        </span>
      </li>
      <li>
        <Link to="/orders">Orders</Link>
      </li>
      {user.role === "admin" && (
        <li>
          <Link to="/admin" className="cursor-pointer">
            Admin Panel
          </Link>
        </li>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ pointerEvents: "auto" }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-10 py-3 ${sticky ? "shadow-xl" : ""}`}
    >
      <div className="max-w-screen-2xl mx-auto bg-white/30 backdrop-blur-xl border border-purple-200 rounded-2xl p-3 shadow-lg flex justify-between items-center">
        {/* Brand & Nav */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-full hover:bg-purple-100 transition"
          >
            <Menu className="w-6 h-6 text-purple-700" />
          </button>

          <span
            className="text-2xl font-bold text-indigo-700 cursor-pointer"
            onClick={() => navigate("/")}
          >
            NovelNimbus
          </span>

          <ul className="hidden lg:flex gap-6 text-gray-700 font-medium">
            {navitems}
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchBar setSearchQuery={setSearchQuery} />
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer">
            <ShoppingBag
              onClick={() => navigate("/cart")}
              className="w-6 h-6 text-purple-700 hover:text-purple-900"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

          {/* User Avatar/Profile */}
          <div className="relative" ref={userDropdownRef}>
            {isLoggedIn ? (
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setTimeout(() => setShowDropdown((prev) => !prev), 0);
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center font-bold text-white">
                    {user.fullname[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:block text-sm font-medium text-gray-800">
                  {user.fullname}
                </span>
                <ChevronDown className="w-4 h-4 text-purple-700" />
              </div>
            ) : (
              <Link
                to="/login"
                className="btn bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-purple-300"
              >
                Login
              </Link>
            )}

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg z-50">
                <ul className="text-sm text-gray-700">
                  <li
                    className="px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed top-20 left-4 right-4 bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-xl z-50">
          <ul className="space-y-2 text-gray-700 font-medium">{navitems}</ul>
        </div>
      )}
    </motion.div>
  );
};

export default Navbar;
