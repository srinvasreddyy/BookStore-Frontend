// src/pages/ProductsByCategory.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { FiGrid, FiList, FiChevronDown, FiShoppingCart, FiChevronRight, FiFolder, FiArrowLeft } from 'react-icons/fi';
import { getAllCategories, apiGet, addItemToCart } from '../lib/api';
import toast from 'react-hot-toast';

// Helper to recursively find a category and its path in the tree
const findCategoryPath = (categories, targetId) => {
  for (const cat of categories) {
    if (cat._id === targetId) return [cat];
    if (cat.children && cat.children.length > 0) {
      const path = findCategoryPath(cat.children, targetId);
      if (path) return [cat, ...path];
    }
  }
  return null;
};

const ProductsByCategory = () => {
  const { category: categoryId } = useParams({ from: '/products/$category' });
  
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(new Set());

  // Derive current category path from the full tree
  const currentCategoryPath = useMemo(() => 
    categoryId && categoryId !== 'all' ? findCategoryPath(categories, categoryId) : [], 
  [categories, categoryId]);
  
  // The current active category object
  const currentCategory = currentCategoryPath ? currentCategoryPath[currentCategoryPath.length - 1] : null;
  
  // Subcategories to display for drilling down
  const subCategories = currentCategory?.children || [];

  // Fetch Full Category Tree
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Category fetch error", err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products based on current category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = '/books';
        // If not 'all', filter by specific category ID
        // Note: Ideally, the backend should return books for this category AND its subcategories.
        if (categoryId && categoryId !== 'all') {
          endpoint += `?category=${categoryId}`;
        }

        const response = await apiGet(endpoint);
        const docs = response.data?.docs || [];
        
        const mapped = docs.map(b => ({
          id: b._id,
          title: b.title,
          author: b.author,
          price: b.price,
          salePrice: b.salePrice,
          image: b.coverImages?.[0] || '',
          rating: 4.5,
          reviews: 0,
          stock: b.stock,
          inStock: b.stock > 0
        }));
        setProducts(mapped);
      } catch (err) {
        console.error(err);
        setError('Failed to load books.');
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0 || categoryId === 'all') {
        fetchProducts();
    }
  }, [categoryId, categories]);

  const addToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(prev => new Set(prev).add(id));
    try {
      await addItemToCart(id, 1);
      toast.success('Added to cart');
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (err) {
      if (err.message?.includes('401')) toast.error('Please login first');
      else toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const pA = a.salePrice || a.price;
    const pB = b.salePrice || b.price;
    if (sortBy === 'price-low') return pA - pB;
    if (sortBy === 'price-high') return pB - pA;
    return 0; 
  });

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* 1. Breadcrumb Navigation */}
      <div className="bg-white border-b border-neutral-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 overflow-x-auto scrollbar-hide whitespace-nowrap">
            <Link to="/" className="text-sm text-neutral-500 hover:text-black transition-colors">Home</Link>
            <FiChevronRight className="mx-2 text-neutral-300 text-sm flex-shrink-0" />
            <Link to="/products/all" className={`text-sm hover:text-black transition-colors ${categoryId === 'all' ? 'font-bold text-black' : 'text-neutral-500'}`}>
              All Books
            </Link>
            
            {currentCategoryPath?.map((cat) => (
              <React.Fragment key={cat._id}>
                <FiChevronRight className="mx-2 text-neutral-300 text-sm flex-shrink-0" />
                <Link 
                  to={`/products/${cat._id}`}
                  className={`text-sm hover:text-black transition-colors ${cat._id === categoryId ? 'font-bold text-black' : 'text-neutral-500'}`}
                >
                  {cat.name}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. Sub-Category Tiles (Visual Navigation) */}
        {subCategories.length > 0 && (
          <div className="mb-10 animate-fadeIn">
            <div className="flex items-center gap-2 mb-4 text-neutral-900 font-bold uppercase tracking-wider text-xs">
              <FiFolder className="text-neutral-400" />
              <span>Explore Subcategories</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {subCategories.map(sub => (
                <Link
                  key={sub._id}
                  to={`/products/${sub._id}`}
                  className="bg-white p-4 rounded-xl border border-neutral-200 hover:border-black hover:shadow-md transition-all group flex flex-col items-center text-center gap-2"
                >
                  {sub.backgroundImage ? (
                    <img src={sub.backgroundImage} alt={sub.name} className="w-10 h-10 object-cover rounded-full" />
                  ) : (
                    <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                      <FiFolder />
                    </div>
                  )}
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-black line-clamp-1">
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 3. Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {currentCategory ? currentCategory.name : 'All Books'}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {loading ? 'Loading...' : `${products.length} books available`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 text-sm font-medium bg-white border border-neutral-200 px-4 py-2.5 rounded-lg hover:border-neutral-400 transition-colors"
              >
                <span className="text-neutral-500">Sort:</span>
                <span className="text-neutral-900">{sortBy === 'popular' ? 'Popular' : sortBy === 'price-low' ? 'Low to High' : 'High to Low'}</span>
                <FiChevronDown className="text-neutral-400" />
              </button>
              
              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-100 shadow-xl rounded-xl py-1 z-40 overflow-hidden animate-fadeIn">
                  {['popular', 'price-low', 'price-high'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === opt ? 'bg-neutral-50 font-bold text-black' : 'text-neutral-600 hover:bg-neutral-50'}`}
                    >
                      {opt === 'popular' ? 'Popular' : opt === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex bg-white border border-neutral-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-neutral-100 text-black shadow-sm' : 'text-neutral-400 hover:text-black'}`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-neutral-100 text-black shadow-sm' : 'text-neutral-400 hover:text-black'}`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Products Grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-900 border-t-transparent"></div>
          </div>
        ) : products.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6" 
            : "space-y-4 max-w-3xl mx-auto"
          }>
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className={`group block bg-white rounded-xl overflow-hidden border border-neutral-200 transition-all hover:shadow-lg hover:border-neutral-300 ${
                  viewMode === 'list' ? 'flex gap-4 p-4' : ''
                }`}
              >
                <div className={`relative bg-neutral-100 overflow-hidden ${
                  viewMode === 'list' ? 'w-24 sm:w-32 aspect-[2/3] rounded-lg flex-shrink-0' : 'aspect-[2/3]'
                }`}>
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300"><FiFolder size={32} /></div>
                  )}
                  {product.salePrice && (
                    <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                      SALE
                    </div>
                  )}
                </div>

                <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1 justify-between' : 'p-4'}`}>
                  <div>
                    <h3 className="font-bold text-neutral-900 leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mb-3">{product.author}</p>
                  </div>
                  
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      {product.salePrice ? (
                        <>
                          <div className="text-lg font-bold text-neutral-900">₹{product.salePrice}</div>
                          <div className="text-xs text-neutral-400 line-through">₹{product.price}</div>
                        </>
                      ) : (
                        <div className="text-lg font-bold text-neutral-900">₹{product.price}</div>
                      )}
                    </div>
                    
                    {product.inStock ? (
                      <button
                        onClick={(e) => addToCart(e, product.id)}
                        disabled={addingToCart.has(product.id)}
                        className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50"
                      >
                        {addingToCart.has(product.id) ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <FiShoppingCart size={16} />
                        )}
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-red-500 bg-red-50 px-2 py-1 rounded">Sold Out</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-300">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <FiFolder size={24} />
            </div>
            <p className="text-lg font-medium text-neutral-900">No books found.</p>
            <p className="text-sm text-neutral-500 mb-6">Try selecting a different subcategory.</p>
            {categoryId !== 'all' && (
              <Link to="/products/all" className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors">
                <FiArrowLeft /> View All Books
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsByCategory;