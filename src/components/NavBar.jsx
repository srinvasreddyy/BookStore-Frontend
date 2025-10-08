import React, { useState, useRef, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { TbCircleLetterBFilled } from "react-icons/tb";
import { LuShoppingBag } from "react-icons/lu";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";

const CATEGORIES = [
  "All",
  "Fiction",
  "Non-fiction",
  "Sci-fi",
  "Fantasy",
  "Children",
  "Biographies",
  "Self-help",
  "Business",
  "Comics",
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
  const [openCat, setOpenCat] = useState(false);
  const [selected, setSelected] = useState("All");
  const ref = useRef(null);
  const [openStrip, setOpenStrip] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const stripRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenCat(false);
      }
      if (stripRef.current && !stripRef.current.contains(e.target)) {
        setOpenStrip(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") {
        setOpenCat(false);
        setOpenStrip(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <header className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6  lg:px-8">
        <div className="flex items-center justify-between h-16 max-lg:h-14">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <div className="text-2xl text-black">
              <TbCircleLetterBFilled />
            </div>
            <a href="#" className="font-extrabold tracking-tight text-neutral-900 uppercase">
              Bookstore
            </a>
          </div>

          {/* Search + Category */}
          <div className="flex-1 max-lg:hidden flex justify-center px-4">
            <div className="w-8/12">
              <div className="flex items-center shadow-xs bg-neutral-50 rounded-md border border-neutral-200 overflow-hidden">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="flex-1 px-4 py-0 text-xs bg-neutral-50 outline-none"
                />
                <button className="h-8 px-3 bg-neutral-900 text-white text-xs flex items-center gap-2">
                  <IoSearch className="text-xs"/>
                  <span className="hidden sm:inline font-semibold">Search</span>
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden md:inline text-xs uppercase font-semibold px-4 py-2 rounded-md">
              Discover
            </button>
            <button className="hidden md:inline bg-neutral-900 text-white text-xs uppercase font-semibold px-10 py-2 rounded-md">
              Login
            </button>
            <button className="text-xl text-neutral-700">
              <LuShoppingBag />
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-2 p-2 text-neutral-700 hover:bg-neutral-100 rounded-md"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* Mobile menu panel */}
            {mobileMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-4 top-14 w-64 py-2 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
              >
                {MENU_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="border-t border-neutral-200 my-2" />
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="flex-1 lg:hidden flex justify-center px-2">
        <div className="w-full mb-3">
          <div className="flex items-center shadow-xs bg-neutral-50 rounded-md border border-neutral-200 overflow-hidden">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="flex-1 px-4 py-0 text-xs bg-neutral-50 outline-none"
            />
            <button className="h-8 px-3 bg-neutral-900 text-white text-xs flex items-center gap-2">
              <IoSearch className="text-xs"/>
              <span className="hidden sm:inline font-semibold">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shop by category dropdown */}
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
                      <a 
                        key={cat} 
                        href="#" 
                        className="block px-3 py-2 text-sm rounded hover:bg-neutral-100"
                        onClick={() => setOpenStrip(false)}
                      >
                        {cat}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="max-lg:hidden">{MENU_ITEMS.map((menu)=>{
                 return <a key={menu.label} href={menu.href} className="ml-6 text-xs  font-semibold hover:underline">{menu.label}</a>  
            })}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;