// src/components/NavBar.js
import React, { useState, useRef, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { TbCircleLetterBFilled } from "react-icons/tb";
import { LuShoppingBag } from "react-icons/lu";
import { FiChevronDown, FiMenu, FiX, FiUser, FiLogOut, FiPackage, FiInfo } from "react-icons/fi";
import { Link, useNavigate } from "@tanstack/react-router";
import SearchOverlay from "./SearchOverlay"; // Import the new component
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { apiPost } from "../lib/api";
import { getAllCategories } from "../lib/api";
import { getCart } from "../lib/api";
import logo from "../assets/logo.png";
const MENU_ITEMS = [
  { label: "Discover", href: "/discover" },
  { label: "Other Products", href: "/other-products" },
  { label: "Grow with us", href: "/grow" },
  { label: "About Us", href: "/about" },
  { label: "Media Coverage", href: "/media" },
  { label: "Free Content", href: "/free" },
  { label: "Blogs", href: "/blogs" },
];

const NavBar = () => {
  const [openStrip, setOpenStrip] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search overlay
  const [categories, setCategories] = useState([]);

  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const stripRef = useRef(null);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  // A cleaner useEffect hook for closing modals
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stripRef.current && !stripRef.current.contains(e.target)) {
        setOpenStrip(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenStrip(false);
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent body scroll when search overlay is open
  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchOpen]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to empty array or default categories if needed
      }
    };
    fetchCategories();
  }, []);

  // Fetch cart count when auth changes or on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchCartCount() {
      if (!isAuthenticated) {
        setCartCount(0);
        return;
      }
      try {
        const resp = await getCart();
        const items = resp.data?.items || [];
        if (!cancelled) setCartCount(items.reduce((s, it) => s + (it.quantity || 0), 0));
      } catch (e) {
        console.error('Failed to fetch cart:', e);
      }
    }
    fetchCartCount();

    const onCartUpdated = () => { fetchCartCount(); };
    window.addEventListener('cart-updated', onCartUpdated);
    return () => { cancelled = true; window.removeEventListener('cart-updated', onCartUpdated); };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await apiPost('/users/logout');
      logout();
      setUserMenuOpen(false);
      toast.success('Logged out successfully');
      navigate({ to: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, clear local state
      logout();
      setUserMenuOpen(false);
      toast.success('Logged out successfully');
      navigate({ to: '/' });
    }
  };

  const SearchTriggerButton = ({ className }) => (
    <button
      onClick={() => setIsSearchOpen(true)}
      className={`flex items-center shadow-xs bg-neutral-50 rounded-md border border-neutral-200 overflow-hidden text-left ${className}`}
      aria-label="Open search"
    >
      <span className="flex-1 px-4 text-xs text-neutral-500">
        What are you looking for?
      </span>
      <div className="h-8 px-3 bg-neutral-900 text-white text-xs flex items-center gap-2">
        <IoSearch className="text-xs" />
        <span className="hidden sm:inline font-semibold">Search</span>
      </div>
    </button>
  );

  return (
    <>
      <header className="w-full bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-fit max-lg:h-fit">
            {/* Logo */}
            <div className="flex items-center gap-1 py-2">
              
              <a
                href="/"
                className="font-extrabold tracking-tight text-neutral-900 uppercase"
              >
                <img src={logo} alt="BookStore Logo" className="h-20 max-lg:h-20 w-auto" />
              </a>
            </div>

            {/* Desktop Search */}
            <div className="flex-1 max-lg:hidden flex justify-center px-4">
              <div className="w-8/12">
                <SearchTriggerButton className="w-full" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    className="relative text-xl text-neutral-700 hover:text-neutral-900 transition-colors"
                    aria-label="Cart"
                  >
                    <LuShoppingBag />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                      aria-expanded={userMenuOpen}
                      aria-label="User menu"
                    >
                      <FiUser className="text-lg" />
                      <span className="hidden sm:inline">{user?.fullName || 'User'}</span>
                      <FiChevronDown className="text-sm" />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 z-50 py-2">
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <FiPackage className="text-lg" />
                          My Orders
                        </Link>
                        <Link
                          to="/about"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <FiInfo className="text-lg" />
                          About
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                        >
                          <FiLogOut className="text-lg" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="hidden md:inline text-xs uppercase font-semibold px-4 py-2 rounded-md"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="hidden md:inline bg-neutral-900 text-white text-xs uppercase font-semibold px-10 py-2 rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/cart"
                    className="text-xl text-neutral-700 hover:text-neutral-900 transition-colors"
                    aria-label="Cart"
                  >
                    <div className="relative">
                      <LuShoppingBag />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5">
                          {cartCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </>
              )}

              {/* Mobile Menu */}
              <div className="relative md:hidden" ref={menuRef}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="ml-2 p-2 text-neutral-700 hover:bg-neutral-100 rounded-md"
                  aria-expanded={mobileMenuOpen}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>

                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 z-50 py-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 text-sm font-medium text-neutral-900 border-b border-neutral-200">
                          {user?.fullName || 'User'}
                        </div>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FiPackage className="text-lg" />
                          My Orders
                        </Link>
                        <Link
                          to="/about"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <FiInfo className="text-lg" />
                          About
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                        >
                          <FiLogOut className="text-lg" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Register
                        </Link>
                        <a
                          href="#about"
                          className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          About
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="flex-1 lg:hidden flex justify-center px-2">
          <div className="w-full mb-3">
            <SearchTriggerButton className="w-full" />
          </div>
        </div>

        {/* Shop by category and navigation */}
        <div className="bg-neutral-900 text-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-2">
              <div className="relative" ref={stripRef}>
                <button
                  onClick={() => setOpenStrip((s) => !s)}
                  aria-expanded={openStrip}
                  className="flex items-center gap-2 cursor-pointer px-3 py-2 bg-neutral-800/60 rounded-md text-xs font-semibold uppercase"
                >
                  Shop by category
                  <FiChevronDown className="text-white text-xl" />
                </button>
                {openStrip && (
                  <div className="absolute mt-2 w-56 bg-white text-neutral-900 rounded-md shadow-lg border border-neutral-200 z-40">
                    <div className="p-2 grid grid-cols-1 gap-1">
                      {[{ name: "All" }, ...categories].map((cat) => (
                        <a
                          key={cat.name}
                          href={`/products/${cat.name.toLowerCase()}`}                          className="block px-3 py-2 text-sm rounded hover:bg-neutral-100"
                          onClick={() => setOpenStrip(false)}
                        >
                          {cat.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <nav className="flex-1 overflow-x-auto hide-horizontal-scroll scrollbar-hide ml-4 lg:ml-6">
                <div className="flex gap-4  lg:gap-6 whitespace-nowrap">
                  {MENU_ITEMS.map((menu) => (
                    <a
                      key={menu.label}
                      href={menu.href}
                      className="text-xs font-semibold hover:underline flex-shrink-0"
                    >
                      {menu.label}
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default NavBar;
