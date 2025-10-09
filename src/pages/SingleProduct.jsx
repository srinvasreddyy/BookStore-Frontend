import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsBookHalf } from "react-icons/bs";

const SingleProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const product = {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 299,
    description:
      "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    publisher: "Scribner",
    publishedYear: 1925,
    isbn: "978-0743273565",
    pages: 180,
    language: "English",
    format: "Hardcover",
    images: [
      "https://plus.unsplash.com/premium_photo-1664006988924-16f386bcd40e?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80",
    ],
    genre: "Classic Literature",
    edition: "First Edition",
  };

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
                  className="w-full rounded-xl bg-cover bg-center max-lg:h-[400px] h-[600px] transition-opacity duration-500"
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
                <p className="mt-4 max-lg:mt-2 text-2xl sm:text-3xl font-bold text-primary">
                  ₹{product.price}
                </p>
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
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 flex items-center justify-center rounded-lg bg-neutral-100 text-black font-bold hover:bg-primary/20 transition-colors"
                >
                  Add to Cart
                </a>
                <a
                  className="w-full h-12 flex items-center justify-center rounded-lg bg-black text-white font-bold hover:opacity-90 transition-opacity"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleProduct;
