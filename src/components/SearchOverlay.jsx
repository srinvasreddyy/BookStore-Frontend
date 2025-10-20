// src/components/SearchOverlay.js
import React, { useState, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { TbCircleLetterBFilled } from "react-icons/tb"; // Logo icon
import { apiGet } from "../lib/api";
import { Link } from '@tanstack/react-router';

// Local fallback in case API fails
const DUMMY_PRODUCTS = [
  { id: 1, name: "The Great Gatsby", category: "Fiction" },
  { id: 2, name: "Sapiens: A Brief History of Humankind", category: "Non-fiction" },
  { id: 3, name: "Dune", category: "Sci-fi" },
];

const SearchOverlay = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Fetch all products once on mount (we'll filter client-side)
  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        // fetch a larger page of books (increase limit if needed)
        const resp = await apiGet('/books?limit=200');
        const docs = resp.data?.docs || [];
        const mapped = docs.map(b => ({
          id: b._id,
          title: b.title,
          author: b.author,
          shortDescription: b.shortDescription,
          fullDescription: b.fullDescription,
          publisher: b.publisher,
          category: b.category?.name || '',
        }));
        if (!cancelled) setAllProducts(mapped);
      } catch (err) {
        console.error('Failed to fetch products for search:', err);
        setError('Failed to load products');
        if (!cancelled) setAllProducts(DUMMY_PRODUCTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = query.trim().toLowerCase();
      if (q === "") {
        setResults([]);
        return;
      }

      // Search across title, author, descriptions and publisher
      const filtered = allProducts.filter(p => {
        return (
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.author && p.author.toLowerCase().includes(q)) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
          (p.fullDescription && p.fullDescription.toLowerCase().includes(q)) ||
          (p.publisher && p.publisher.toLowerCase().includes(q))
        )
      });

      setResults(filtered);
    }, 200);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, allProducts]);

  return (
    <div
      className="fixed inset-0 bg-white max-lg:top-22 z-[100] p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Centered Content Wrapper */}
      <div className="w-full max-w-2xl mx-auto">
        {/* Header with Search Input and Close Button (LOGO REMOVED FROM HERE) */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 flex items-center border bg-neutral-100 border-neutral-300 rounded-md overflow-hidden">
            <IoSearch className="text-neutral-400 text-lg mx-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books, authors, and more..."
              className="w-full max-lg:text-xs text-sm max-lg:h-8 h-10 outline-none  bg-neutral-100"
            />
          </div>
          <button
            onClick={onClose}
            className="p-2 cursor-pointer text-neutral-500 hover:text-neutral-900"
            aria-label="Close search"
          >
            <FiX size={28} />
          </button>
        </div>

        {/* Results Section */}
        <div className="overflow-y-auto">
          {loading ? (
            <div className="text-center text-neutral-500 py-8">Loading products...</div>
          ) : query.trim() === "" ? (
            <div className="text-center text-neutral-500 pt-10">
              <p>Start typing to find your next great read.</p>
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li key={product.id} className="p-4 border-b border-neutral-200 hover:bg-neutral-50 rounded-md">
                  <Link to="/product/$id" params={{ id: String(product.id) }} onClick={onClose} className="block">
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-neutral-600">{product.author} {product.publisher ? `• ${product.publisher}` : ''}</p>
                    <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{product.shortDescription || ''}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-neutral-500 pt-10">
              <p>No results found for "{query}".</p>
            </div>
          )}
          {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
        </div>
      </div>

      {/* LOGO AT THE BOTTOM (visible on large screens) */}
      <div className="absolute bottom-6 left-0 right-0 hidden lg:flex justify-center items-center gap-2 text-neutral-800">
        <TbCircleLetterBFilled size={20} />
        <span className="font-bold tracking-tight uppercase text-xs">
          Bookstore
        </span>
      </div>
    </div>
  );
};

export default SearchOverlay;