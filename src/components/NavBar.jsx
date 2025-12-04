// src/components/NavBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { LuShoppingBag } from "react-icons/lu";
import { FiChevronDown, FiChevronRight, FiMenu, FiX, FiUser, FiLogOut, FiPackage, FiInfo } from "react-icons/fi";
import { Link, useNavigate } from "@tanstack/react-router";
import SearchOverlay from "./SearchOverlay"; 
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { apiPost, getAllCategories, getCart } from "../lib/api";
import logo from "../assets/logo.png";

const MENU_ITEMS = [
  { label: "About Us", href: "/about" },
  { label: "Old Books", href: "/old-books" },
  { label: "Media Coverage", href: "/media" },
  { label: "Free Content", href: "/free" },
  { label: "Specials", href: "/specials", isSpecial: true },
];

const NavBar = () => {
  const [openStrip, setOpenStrip] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const [categories, setCategories] = useState([]);
  
  // Mobile Category State for Accordion
  const [mobileExpanded, setMobileExpanded] = useState({});

  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const stripRef = useRef(null);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await getAllCategories();
        setCategories(catRes.data || []);
      } catch (error) {
        console.error('Failed to fetch navbar data:', error);
      }
    };
    fetchData();
  }, []);

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

  // --- Event Listeners ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stripRef.current && !stripRef.current.contains(e.target)) setOpenStrip(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileMenuOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await apiPost('/users/logout');
      logout();
      setUserMenuOpen(false);
      toast.success('Logged out successfully');
      navigate({ to: '/' });
    } catch (error) {
      logout();
      navigate({ to: '/' });
    }
  };

  const toggleMobileCategory = (id) => {
    setMobileExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const SearchTriggerButton = ({ className }) => (
    <button
      onClick={() => setIsSearchOpen(true)}
      className={`flex items-center bg-neutral-50 rounded-full border border-neutral-200 overflow-hidden text-left hover:border-neutral-400 transition-colors shadow-sm ${className}`}
    >
      <span className="flex-1 px-4 text-xs sm:text-sm text-neutral-500 truncate">
        Search for books, authors...
      </span>
      <div className="h-full aspect-square bg-neutral-900 text-white flex items-center justify-center">
        <IoSearch className="text-sm" />
      </div>
    </button>
  );

  // Recursive Component for Desktop Hover Menu
  const CategoryItem = ({ category }) => {
    const hasChildren = category.children && category.children.length > 0;
    
    return (
      <div className="group/item relative w-full">
        <Link
          to={`/products/${category._id}`}
          className="flex items-center justify-between px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors w-full"
          onClick={() => setOpenStrip(false)}
        >
          <span>{category.name}</span>
          {hasChildren && <FiChevronRight className="text-neutral-400 text-xs" />}
        </Link>
        
        {/* Nested Dropdown */}
        {hasChildren && (
          <div className="absolute left-full top-0 w-64 bg-white border border-neutral-200 shadow-xl rounded-r-md hidden group-hover/item:block z-50 min-h-full animate-fadeIn">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-neutral-100 bg-neutral-50">
                <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                  {category.name}
                </span>
              </div>
              {category.children.map(child => (
                <CategoryItem key={child._id} category={child} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Recursive Component for Mobile Accordion
  const MobileCategoryItem = ({ category, depth = 0 }) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = mobileExpanded[category._id];

    return (
      <div className={`border-l-2 ${depth > 0 ? 'border-neutral-200 ml-3' : 'border-transparent'}`}>
        <div className="flex items-center justify-between pr-2 py-2">
          <Link 
            to={`/products/${category._id}`}
            className="text-base text-neutral-800 font-medium block flex-1 pl-2 active:text-blue-600 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            {category.name}
          </Link>
          {hasChildren && (
            <button 
              onClick={(e) => { e.preventDefault(); toggleMobileCategory(category._id); }}
              className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-neutral-100 text-black' : 'text-neutral-400'}`}
            >
              {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
            </button>
          )}
        </div>
        
        {/* Expandable Children */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {hasChildren && category.children.map(child => (
            <MobileCategoryItem key={child._id} category={child} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="w-full bg-white sticky top-0 z-50 shadow-sm transition-all duration-300">
        
        {/* Main Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 lg:py-4 gap-4">
            
            {/* Logo - Increased Size */}
            <Link to="/" className="flex-shrink-0 transition-transform active:scale-95">
              <img 
                src={logo} 
                alt="BookStore" 
                className="h-14 lg:h-20 w-auto object-contain" 
              />
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:block flex-1 max-w-xl mx-8">
              <SearchTriggerButton className="w-full h-11" />
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-6">
              {isAuthenticated ? (
                <>
                  <Link to="/cart" className="relative p-2 text-neutral-700 hover:text-black transition-colors">
                    <LuShoppingBag size={24} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1 pr-3 rounded-full border border-neutral-200 hover:shadow-md transition-all"
                    >
                      <div className="w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center">
                        <FiUser size={16} />
                      </div>
                      <span className="text-sm font-medium">{user.fullName?.split(' ')[0]}</span>
                      <FiChevronDown size={14} />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden animate-slideDown origin-top-right">
                        <Link to="/orders" className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-neutral-50" onClick={() => setUserMenuOpen(false)}>
                          <FiPackage /> My Orders
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-5 py-3 text-sm text-red-600 hover:bg-red-50 text-left">
                          <FiLogOut /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg">Login</Link>
                  <Link to="/register" className="px-5 py-2.5 text-sm font-semibold bg-black text-white rounded-lg hover:bg-neutral-800 shadow-lg shadow-neutral-200">Sign Up</Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-3">
              <SearchTriggerButton className="w-8 h-8 p-0 border-0 bg-transparent shadow-none [&>span]:hidden [&>div]:bg-transparent [&>div]:text-neutral-800 [&>div]:text-xl" />
              
              <Link to="/cart" className="relative p-2 text-neutral-800">
                <LuShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-neutral-800"
              >
                <FiMenu size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Menu */}
        <div className="lg:hidden w-full border-t border-b border-neutral-100 bg-neutral-50/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 overflow-x-auto px-4 py-3 scrollbar-hide">
            <Link 
              to="/products/all"
              className="flex-shrink-0 text-sm font-semibold text-neutral-900 whitespace-nowrap px-3 py-1 bg-white rounded-full border border-neutral-200 shadow-sm"
            >
              Shop All
            </Link>
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex-shrink-0 text-sm font-medium whitespace-nowrap px-2 ${
                  item.isSpecial ? 'text-amber-600 font-bold' : 'text-neutral-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Secondary Navigation */}
        <div className="hidden lg:block border-t border-neutral-100 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center gap-8 h-12 text-xs font-bold uppercase tracking-widest text-neutral-500">
              <div className="relative h-full flex items-center" ref={stripRef}>
                <button
                  onClick={() => setOpenStrip(!openStrip)}
                  className={`flex items-center gap-2 h-full hover:text-black transition-colors ${openStrip ? 'text-black' : ''}`}
                >
                  <FiMenu size={16} />
                  <span>Shop By Category</span>
                </button>
                {openStrip && (
                  <div className="absolute top-full left-0 w-72 bg-white border border-neutral-200 shadow-2xl rounded-b-lg z-40 animate-slideDown">
                    <div className="py-2">
                      <Link to="/products/all" className="block px-4 py-3 text-sm font-bold text-black hover:bg-neutral-50 border-b border-neutral-100" onClick={() => setOpenStrip(false)}>
                        Browse All Books
                      </Link>
                      {categories.map((cat) => (
                        <CategoryItem key={cat._id} category={cat} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {MENU_ITEMS.map(item => (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={`flex items-center h-full hover:text-black transition-colors relative group ${item.isSpecial ? 'text-amber-600' : ''}`}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl animate-slideInRight flex flex-col">
            
            <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-neutral-50">
              <span className="font-bold text-lg text-neutral-900">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white rounded-full shadow-sm text-neutral-500">
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {isAuthenticated && (
                <div className="mb-6 p-4 bg-neutral-900 rounded-xl text-white shadow-lg">
                  <p className="text-xs text-neutral-400 mb-1">Signed in as</p>
                  <p className="font-bold truncate">{user.email}</p>
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-4">Categories</h3>
                  <div className="space-y-1">
                    <Link to="/products/all" className="block py-2 text-base font-semibold text-neutral-900" onClick={() => setMobileMenuOpen(false)}>
                      All Books
                    </Link>
                    {categories.map(cat => (
                      <MobileCategoryItem key={cat._id} category={cat} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase text-neutral-400 tracking-wider mb-4">Discover</h3>
                  <div className="space-y-2">
                    {MENU_ITEMS.map(item => (
                      <Link 
                        key={item.href} 
                        to={item.href} 
                        className="block py-2 text-base font-medium text-neutral-700 active:text-black"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-neutral-100 bg-neutral-50">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full py-3 bg-white border border-neutral-200 rounded-xl font-bold text-red-600 shadow-sm active:scale-95 transition-transform">
                  Log Out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" className="py-3 text-center bg-white border border-neutral-200 rounded-xl font-bold text-neutral-800" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="py-3 text-center bg-black text-white rounded-xl font-bold" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default NavBar;