import React, { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { FiGrid, FiList, FiChevronDown, FiShoppingCart } from 'react-icons/fi';

// Sample product data - replace with actual API data
const ALL_PRODUCTS = {
  classic: [
    {
      id: 1,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 299,
      originalPrice: 499,
      rating: 4.5,
      reviews: 234,
      image: "https://plus.unsplash.com/premium_photo-1715107534067-040e38ee7049?q=80&w=764&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: 2,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 249,
      originalPrice: 399,
      rating: 4.7,
      reviews: 456,
      image: "https://plus.unsplash.com/premium_photo-1669652639337-c513cc42ead6?q=80&w=687&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: 3,
      title: "Jane Eyre",
      author: "Charlotte Brontë",
      price: 279,
      originalPrice: 449,
      rating: 4.6,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
      inStock: true,
    },
    {
      id: 4,
      title: "Wuthering Heights",
      author: "Emily Brontë",
      price: 269,
      originalPrice: 429,
      rating: 4.4,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
      inStock: true,
    },
    {
      id: 5,
      title: "Moby-Dick",
      author: "Herman Melville",
      price: 349,
      originalPrice: 549,
      rating: 4.3,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
      inStock: false,
    },
    {
      id: 6,
      title: "Emma",
      author: "Jane Austen",
      price: 289,
      originalPrice: 479,
      rating: 4.5,
      reviews: 198,
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
      inStock: true,
    },
  ],
  romance: [
    {
      id: 7,
      title: "The Notebook",
      author: "Nicholas Sparks",
      price: 299,
      originalPrice: 499,
      rating: 4.6,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
      inStock: true,
    },
    {
      id: 8,
      title: "Me Before You",
      author: "Jojo Moyes",
      price: 349,
      originalPrice: 549,
      rating: 4.7,
      reviews: 432,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
      inStock: true,
    },
  ],
  thriller: [
    {
      id: 9,
      title: "Gone Girl",
      author: "Gillian Flynn",
      price: 399,
      originalPrice: 599,
      rating: 4.8,
      reviews: 789,
      image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80",
      inStock: true,
    },
  ],
  fantasy: [
    {
      id: 10,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      price: 449,
      originalPrice: 699,
      rating: 4.9,
      reviews: 1234,
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
      inStock: true,
    },
  ],
  'sci-fi': [
    {
      id: 11,
      title: "Dune",
      author: "Frank Herbert",
      price: 499,
      originalPrice: 799,
      rating: 4.8,
      reviews: 987,
      image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80",
      inStock: true,
    },
  ],
  gk: [
    {
      id: 12,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      price: 549,
      originalPrice: 799,
      rating: 4.7,
      reviews: 654,
      image: "https://images.unsplash.com/photo-1695774165691-8a01a6045952?q=80&w=1169&auto=format&fit=crop",
      inStock: true,
    },
  ],
};

const ProductsByCategory = () => {
  const { category } = useParams({ from: '/products/$category' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const products = ALL_PRODUCTS[category] || [];
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black font-medium">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl max-lg:text-xl font-bold text-gray-900 mb-2">{categoryName} Books</h1>
          <p className="text-gray-600 max-lg:text-xs text-sm">{products.length} products found</p>
        </div>

        {/* Filters & View Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <span>Sort by: {sortBy === 'popular' ? 'Popular' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Rating'}</span>
                <FiChevronDown />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button onClick={() => { setSortBy('popular'); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Popular</button>
                  <button onClick={() => { setSortBy('price-low'); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Price: Low to High</button>
                  <button onClick={() => { setSortBy('price-high'); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Price: High to Low</button>
                  <button onClick={() => { setSortBy('rating'); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Rating</button>
                </div>
              )}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiList size={18} />
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                to="/product/$id"
                params={{ id: String(product.id) }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[3/4] bg-gray-100">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2">{product.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{product.author}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500 text-sm">★ {product.rating}</span>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold">₹{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                  </div>
                  {product.inStock ? (
                    <button className="w-full bg-black text-white py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <FiShoppingCart size={16} />
                      Add to Cart
                    </button>
                  ) : (
                    <button disabled className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-not-allowed">
                      Out of Stock
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                to="/product/$id"
                params={{ id: String(product.id) }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex"
              >
                <div className="w-32 sm:w-48 flex-shrink-0 bg-gray-100">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4 sm:p-6 flex flex-col sm:flex-row justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.author}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-500">★ {product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end justify-between">
                    <div className="mb-3">
                      <div className="text-2xl font-bold mb-1">₹{product.price}</div>
                      <div className="text-sm text-gray-500 line-through">₹{product.originalPrice}</div>
                    </div>
                    {product.inStock ? (
                      <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <FiShoppingCart size={16} />
                        Add to Cart
                      </button>
                    ) : (
                      <button disabled className="bg-gray-300 text-gray-600 px-6 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Products Message */}
        {products.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No products found in this category.</p>
            <Link to="/" className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsByCategory;