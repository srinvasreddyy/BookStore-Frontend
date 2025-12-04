// src/components/Home/CategoryCards.jsx
import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { getAllCategories } from "../../lib/api";
import { FiArrowRight } from "react-icons/fi";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80&auto=format&fit=crop";

const CategoryCards = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        // Only show top-level categories (level 1) for the homepage
        const rootCategories = (response.data || []).filter(c => c.level === 1 || !c.parent);
        setCategories(rootCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-14 flex justify-center">
        <div className="animate-pulse flex gap-6 w-full overflow-hidden">
           <div className="h-64 w-full bg-neutral-200 rounded-xl"></div>
           <div className="h-64 w-full bg-neutral-200 rounded-xl hidden sm:block"></div>
           <div className="h-64 w-full bg-neutral-200 rounded-xl hidden md:block"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="font-bold text-neutral-500 text-xs uppercase tracking-widest mb-2">
            Discover
          </p>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Shop By Category
          </h2>
        </div>
        <Link 
          to="/products/all" 
          className="hidden sm:flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:underline underline-offset-4"
        >
          View All <FiArrowRight />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/products/${category._id}`}
            className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
          >
            {/* Background Image */}
            <img
              src={category.backgroundImage || DEFAULT_IMAGE}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <h3 className="text-xl font-bold text-white mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {category.name}
              </h3>
              <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                <p className="text-xs text-neutral-300 mt-2 line-clamp-2 leading-relaxed">
                  {category.description || "Explore our collection"}
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-white uppercase tracking-wider gap-2">
                  Explore <FiArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Mobile View All Card */}
        <Link
          to="/products/all"
          className="sm:hidden group relative h-64 rounded-2xl overflow-hidden border-2 border-dashed border-neutral-300 hover:border-black transition-colors flex flex-col items-center justify-center bg-neutral-50"
        >
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
            <FiArrowRight className="text-2xl text-black" />
          </div>
          <span className="font-bold text-neutral-900">Browse All Categories</span>
        </Link>
      </div>
    </div>
  );
};

export default CategoryCards;