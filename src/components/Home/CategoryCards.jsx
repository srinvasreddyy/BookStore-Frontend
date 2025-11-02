import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { getAllCategories } from "../../lib/api";

const IMAGE_MAP = {
  "Classic": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80&auto=format&fit=crop",
  "Romance": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80&auto=format&fit=crop",
  "Thriller": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop",
  "Fantasy": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80&auto=format&fit=crop",
  "Sci-Fi": "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80&auto=format&fit=crop",
  "GK": "https://images.unsplash.com/photo-1695774165691-8a01a6045952?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80&auto=format&fit=crop"; // Default to romance image

const CATEGORIES = [
  {
    name: "Classic",
    slug: "classic",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Romance",
    slug: "romance",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Thriller",
    slug: "thriller",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Fantasy",
    slug: "fantasy",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "Sci-Fi",
    slug: "sci-fi",
    image:
      "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&q=80&auto=format&fit=crop",
  },
  {
    name: "GK",
    slug: "gk",
    image:
      "https://images.unsplash.com/photo-1695774165691-8a01a6045952?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const CategoryCards = () => {
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const fetchedCategories = response.data || [];
        
        const mappedCategories = fetchedCategories.map((category) => ({
          name: category.name,
          slug: category.name.toLowerCase().replace(/\s+/g, '-'),
          image: category.backgroundImage || IMAGE_MAP[category.name] || DEFAULT_IMAGE,
        }));
        
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Keep the default categories if fetch fails
      }
    };

    fetchCategories();
  }, []);
  return (
    <div className="w-full max-w-7xl h-fit mx-auto px-4 sm:px-6 py-14 max-lg:py-8 lg:px-8">
      <div>
        <p className="font-bold text-neutral-500 max-lg:text-[9px] uppercase text-xs">
          Discover
        </p>
        <h2 className="text-2xl max-lg:text-lg font-bold mb-4">
          Shop By Categories
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-lg:hidden">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/products/${category.name.toLowerCase()}`}
            params={{ category: category.slug }}
            // The 'group' class is key for the hover effects on child elements
            className="relative group h-60 max-lg:h-48 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
          >
            <img
              src={category.image}
              alt={category.name}
              // Image zooms in on hover of the parent 'group'
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Dark overlay for text readability, darkens on hover */}
            <div className="absolute inset-0 bg-black/50 bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-300"></div>

            {/* Centered content container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <h3 
                className="text-white text-2xl font-bold tracking-wide transform transition-transform duration-300 group-hover:scale-105"
              >
                {category.name}
              </h3>
              <p 
                // This text fades in on hover
                className="max-lg:hidden text-white text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Shop Now
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="lg:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products/${category.name.toLowerCase()}`}
              params={{ category: category.slug }}
              className="relative group flex-shrink-0 w-48 h-48 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />

              {/* Dark overlay for text readability, darkens on hover */}
              <div className="absolute inset-0 bg-black/50 bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-300"></div>

              {/* Centered content container */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <h3
                  className="text-white text-xl font-bold tracking-wide transform transition-transform duration-300 group-hover:scale-105"
                >
                  {category.name}
                </h3>
                <p
                  className="text-white text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Shop Now
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCards;