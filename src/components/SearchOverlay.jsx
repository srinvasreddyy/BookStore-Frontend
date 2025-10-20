// src/components/SearchOverlay.js
import React, { useState, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { TbCircleLetterBFilled } from "react-icons/tb"; // Logo icon

// Dummy data to simulate API results
const DUMMY_PRODUCTS = [
  { id: 1, name: "The Great Gatsby", category: "Fiction" },
  { id: 2, name: "Sapiens: A Brief History of Humankind", category: "Non-fiction" },
  { id: 3, name: "Dune", category: "Sci-fi" },
  { id: 4, name: "The Hobbit", category: "Fantasy" },
  { id: 5, name: "To Kill a Mockingbird", category: "Fiction" },
  { id: 6, name: "Atomic Habits", category: "Self-help" },
];

const SearchOverlay = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    const filteredResults = DUMMY_PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredResults);
  }, [query]);

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
          {query.trim() === "" ? (
            <div className="text-center text-neutral-500 pt-10">
              <p>Start typing to find your next great read.</p>
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li key={product.id} className="p-4 border-b border-neutral-200 hover:bg-neutral-50 rounded-md">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-neutral-600">{product.category}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-neutral-500 pt-10">
              <p>No results found for "{query}".</p>
            </div>
          )}
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