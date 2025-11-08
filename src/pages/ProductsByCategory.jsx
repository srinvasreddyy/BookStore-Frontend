import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { FiGrid, FiList, FiChevronDown, FiShoppingCart } from 'react-icons/fi';
import { getAllCategories, getBooksByCategory, apiGet, addItemToCart } from '../lib/api';
import toast from 'react-hot-toast';

const ProductsByCategory = () => {
  const { category } = useParams({ from: '/products/$category' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [addingToCart, setAddingToCart] = useState(new Set()); // Track which items are being added

  const addToCart = async (bookId) => {
    try {
      setAddingToCart(prev => new Set(prev).add(bookId));
      await addItemToCart(bookId, 1);
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;

      setLoading(true);
      setError(null);

      try {
        if (category.toLowerCase() === "all") {
          setCurrentCategory({ name: "All" });

          // Fetch all books
          const response = await apiGet('/books');
          const books = response.data?.docs || [];

          // Transform books to match the expected product format
          const transformedProducts = books.map(book => ({
            id: book._id,
            title: book.title,
            author: book.author,
            price: book.price,
            originalPrice: Math.round(book.price * 1.5), // Estimate original price
            rating: 4.5, // Default rating since not in model
            reviews: 0, // Default reviews count
            image: book.coverImages?.[0] || '', // Use first cover image
            inStock: book.stock > 0,
            stock: book.stock,
            format: book.format,
            language: book.language,
            shortDescription: book.shortDescription,
          }));

          setProducts(transformedProducts);
        } else {
          if (categories.length === 0) return;

          // Find the category object by name or ID
          const categoryObj = categories.find(cat =>
            cat.name.toLowerCase() === category.toLowerCase() || cat._id === category
          );

          if (!categoryObj) {
            setError('Category not found');
            setProducts([]);
            setCurrentCategory(null);
            setLoading(false);
            return;
          }

          setCurrentCategory(categoryObj);
          // Check for optional subcategory in the URL search params
          const searchParams = new URLSearchParams(window.location.search);
          const subId = searchParams.get('sub');

          // Fetch books for this category, optionally filter by subCategory
          const response = await getBooksByCategory(categoryObj._id, subId ? { subCategory: subId } : {});
          const books = response.data?.docs || [];

          // If subId is present, try to attach current subcategory name for UI header
          if (subId) {
            const subObj = (categoryObj.subCategories || []).find(s => s._id === subId || s._id === String(subId));
            if (subObj) setCurrentCategory(prev => ({ ...categoryObj, currentSub: subObj }));
          }
          // Transform books to match the expected product format
          const transformedProducts = books.map(book => ({
            id: book._id,
            title: book.title,
            author: book.author,
            price: book.price,
            originalPrice: Math.round(book.price * 1.5), // Estimate original price
            rating: 4.5, // Default rating since not in model
            reviews: 0, // Default reviews count
            image: book.coverImages?.[0] || '', // Use first cover image
            inStock: book.stock > 0,
            stock: book.stock,
            format: book.format,
            language: book.language,
            shortDescription: book.shortDescription,
          }));

          setProducts(transformedProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, categories]);

  const categoryName = currentCategory?.currentSub?.name || currentCategory?.name || (category ? category.charAt(0).toUpperCase() + category.slice(1) : '');

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
          <p className="text-gray-600 max-lg:text-xs text-sm">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Filters & View Controls */}
        {!loading && !error && products.length > 0 && (
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
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        )}

        {/* Products Grid/List */}
        {!loading && !error && viewMode === 'grid' && (
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
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product.id);
                      }}
                      disabled={addingToCart.has(product.id)}
                      className="w-full bg-black text-white py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiShoppingCart size={16} />
                      {addingToCart.has(product.id) ? 'Adding...' : 'Add to Cart'}
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
        )}

        {!loading && !error && viewMode === 'list' && (
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
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product.id);
                        }}
                        disabled={addingToCart.has(product.id)}
                        className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiShoppingCart size={16} />
                        {addingToCart.has(product.id) ? 'Adding...' : 'Add to Cart'}
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
        {!loading && !error && products.length === 0 && (
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