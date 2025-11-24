import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { FiShoppingCart, FiBook, FiClock } from 'react-icons/fi';
import { apiGet, addItemToCart } from '../lib/api';
import toast from 'react-hot-toast';

const OldBooks = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(new Set()); // Track which items are being added

  const addToCart = async (bookId) => {
    try {
      setAddingToCart(prev => new Set(prev).add(bookId));
      await addItemToCart(bookId, 1);
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      if (err.message?.includes('401') || err.message?.toLowerCase().includes('unauthorized')) {
          toast.error('Please log in to add to cart');
      } else {
          toast.error('Failed to add to cart');
      }
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    const fetchOldBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all books and filter client-side for oldBook === true
        const response = await apiGet('/books');
        const allBooks = response.data?.docs || [];

        // Filter for old books
        const oldBooks = allBooks.filter(book => book.oldBook === true);

        // Transform books to match the expected product format
        const transformedProducts = oldBooks.map(book => ({
          id: book._id,
          title: book.title,
          author: book.author,
          price: book.price,
          salePrice: book.salePrice, // Include salePrice
          rating: 4.5, // Default rating since not in model
          reviews: 0, // Default reviews count
          image: book.coverImages?.[0] || '', // Use first cover image
          inStock: book.stock > 0,
          stock: book.stock,
          oldBook: book.oldBook
        }));

        setProducts(transformedProducts);
      } catch (err) {
        console.error('Failed to fetch old books:', err);
        setError('Failed to load old books collection');
      } finally {
        setLoading(false);
      }
    };

    fetchOldBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black font-medium">Old Books</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl max-lg:text-xl font-bold text-gray-900 mb-2">Vintage & Old Books</h1>
          <p className="text-gray-600 max-lg:text-xs text-sm">
            {loading ? 'Curating collection...' : `${products.length} rare finds available`}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to="/product/$id"
                params={{ id: String(product.id) }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <div className="aspect-[3/4] bg-gray-100 relative group">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                        <FiBook size={32} />
                     </div>
                  )}
                  {/* Badge */}
                  <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                    Vintage
                  </div>
                </div>
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-2 text-gray-900">{product.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{product.author}</p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                       {product.salePrice ? (
                          <>
                            <span className="text-lg font-bold text-gray-900">₹{product.salePrice}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        )}
                    </div>
                    {product.inStock ? (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product.id);
                        }}
                        disabled={addingToCart.has(product.id)}
                        className="w-full bg-black text-white py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State / Check Back Later */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiClock className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Check Back Later</h2>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                    We are currently hunting for rare and vintage editions to add to our collection. 
                    Please check back soon for some timeless classics!
                </p>
                <Link 
                    to="/" 
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors w-full sm:w-auto"
                >
                    Browse New Arrivals
                </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OldBooks;