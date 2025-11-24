import React, { useState, useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsBookHalf } from "react-icons/bs";
import { getBookById, addItemToCart } from "../lib/api";
import toast from "react-hot-toast";

const SingleProduct = () => {
  const { id } = useParams({ from: '/product/$id' });
  const [currentImage, setCurrentImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const addToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      await addItemToCart(product.id, 1);
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
        toast.error('Please log in to add items to cart');
        // Optionally redirect to login
        // navigate({ to: '/login' });
      } else {
        toast.error('Failed to add to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getBookById(id);
        const book = response.data;

        // Transform book data to match component structure
        const transformedProduct = {
          id: book._id,
          title: book.title,
          author: book.author,
          price: book.price,
          salePrice: book.salePrice, // Added salePrice
          description: book.fullDescription || book.shortDescription,
          publisher: book.publisher,
          publishedYear: book.createdAt ? new Date(book.createdAt).getFullYear() : 'N/A',
          isbn: book.isbn,
          pages: book.numberOfPages,
          language: book.language,
          format: book.format,
          images: book.coverImages || [],
          genre: book.category?.name || 'N/A', // Assuming category is populated
          edition: 'N/A', // Not available in model
        };

        setProduct(transformedProduct);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light text-[#0D141B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background-light text-[#0D141B] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <a href="/" className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImage((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="font-display bg-background-light text-[#0D141B] min-h-screen flex flex-col">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 flex text-sm font-medium text-black/60">
            <a href="#" className="hover:text-primary flex items-center gap-2">
              
              <span>Bookstore</span>
            </a>
            <span className="mx-1">/</span>
            <span className="text-black/90">{product.genre}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Hero Image */}
            <div className="lg:col-span-3 relative">
              <div className="relative">
                <div
                  className="w-full rounded-xl bg-contain bg-no-repeat bg-center max-lg:h-[400px] h-[600px] transition-opacity duration-500"
                  style={{
                    backgroundImage: `url(${product.images[currentImage]})`,
                  }}
                ></div>
                
                {/* Navigation arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <FiChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
              
              {/* Thumbnail navigation */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-20 h-20 rounded-lg flex-shrink-0 transition-opacity ${
                      currentImage === idx ? 'opacity-100 ring-2 ring-black' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 flex flex-col max-lg:space-y-3 space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {product.title}
                </h1>
                <p className="mt-2 text-lg text-black/60">{product.author}</p>
                <div className="mt-4 max-lg:mt-2">
                  {product.salePrice ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl font-bold text-primary">₹{product.salePrice}</span>
                      <span className="text-lg sm:text-xl text-gray-500 line-through">₹{product.price}</span>
                    </div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold text-primary">
                      ₹{product.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Book Details */}
              <div className="rounded-lg bg-black/5 p-4 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider">
                  Book Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-black/60">Publisher</div>
                  <div className="font-medium">{product.publisher}</div>
                  
                  <div className="text-black/60">Published</div>
                  <div className="font-medium">{product.publishedYear}</div>
                  
                  <div className="text-black/60">Edition</div>
                  <div className="font-medium">{product.edition}</div>
                  
                  <div className="text-black/60">Pages</div>
                  <div className="font-medium">{product.pages}</div>
                  
                  <div className="text-black/60">Language</div>
                  <div className="font-medium">{product.language}</div>
                  
                  <div className="text-black/60">Format</div>
                  <div className="font-medium">{product.format}</div>
                  
                  <div className="text-black/60">ISBN</div>
                  <div className="font-medium">{product.isbn}</div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm sm:prose-base text-black/80">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p>{product.description}</p>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <button
                  onClick={addToCart}
                  disabled={addingToCart || loading}
                  className="w-full h-12 flex items-center justify-center rounded-lg bg-neutral-100 text-black font-bold hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <Link
                  to="/cart"
                  className="w-full h-12 flex items-center justify-center rounded-lg bg-black text-white font-bold hover:opacity-90 transition-opacity"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleProduct;