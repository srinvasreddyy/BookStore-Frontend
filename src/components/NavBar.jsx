// src/components/NavBar.js
import React, { useState, useRef, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { TbCircleLetterBFilled } from "react-icons/tb";
import { LuShoppingBag } from "react-icons/lu";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { Link } from "@tanstack/react-router";
import SearchOverlay from "./SearchOverlay"; // Import the new component

const CATEGORIES = [
  "All", "Fiction", "Non-fiction", "Sci-fi", "Fantasy", "Children",
  "Biographies", "Self-help", "Business", "Comics",
];

const MENU_ITEMS = [
  { label: "Discover", href: "#discover" },
  { label: "Other Products", href: "#other-products" },
  { label: "Grow with us", href: "#grow" },
  { label: "Coaching Institutes", href: "#coaching" },
  { label: "Media Coverage", href: "#media" },
  { label: "Free Content", href: "#free" },
  { label: "Blogs", href: "#blogs" },
];

const NavBar = () => {
  const [openStrip, setOpenStrip] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search overlay
  
  const stripRef = useRef(null);
  const menuRef = useRef(null);
  
  // A cleaner useEffect hook for closing modals
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stripRef.current && !stripRef.current.contains(e.target)) {
        setOpenStrip(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpenStrip(false);
        setMobileMenuOpen(false);
        setIsSearchOpen(false); // Also close search on Escape
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  // Prevent body scroll when the search overlay is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSearchOpen]);

  // This is a button that looks like your search input to trigger the overlay
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
          <div className="flex items-center justify-between h-16 max-lg:h-14">
            {/* Logo */}
            <div className="flex items-center gap-1">
              <div className="text-2xl text-black">
                <TbCircleLetterBFilled />
              </div>
              <a href="/" className="font-extrabold tracking-tight text-neutral-900 uppercase">
                Bookstore
              </a>
            </div>

            {/* Desktop Search Trigger */}
            <div className="flex-1 max-lg:hidden flex justify-center px-4">
              <div className="w-8/12">
                <SearchTriggerButton className="w-full" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link to="/register" className="hidden md:inline text-xs uppercase font-semibold px-4 py-2 rounded-md">
                Register
              </Link>
              <Link to="/login" className="hidden md:inline bg-neutral-900 text-white text-xs uppercase font-semibold px-10 py-2 rounded-md">
                Login
              </Link>
              <Link to="/cart" className="text-xl text-neutral-700 hover:text-neutral-900 transition-colors" aria-label="Cart">
                <LuShoppingBag />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden ml-2 p-2 text-neutral-700 hover:bg-neutral-100 rounded-md"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Trigger */}
        <div className="flex-1 lg:hidden flex justify-center px-2">
          <div className="w-full mb-3">
             <SearchTriggerButton className="w-full"/>
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
                      {CATEGORIES.map((cat) => (
                        <a key={cat} href="#" className="block px-3 py-2 text-sm rounded hover:bg-neutral-100" onClick={() => setOpenStrip(false)}>
                          {cat}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <nav className="max-lg:hidden">
                {MENU_ITEMS.map((menu) => (
                  <a key={menu.label} href={menu.href} className="ml-6 text-xs font-semibold hover:underline">
                    {menu.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Conditionally render the Search Overlay */}
      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default NavBar;