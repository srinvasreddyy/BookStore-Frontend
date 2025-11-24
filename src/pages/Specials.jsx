import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { FiX, FiChevronLeft, FiChevronRight, FiImage, FiGift, FiLayers, FiInfo, FiMaximize2 } from 'react-icons/fi';
import { apiGet, getSpecials } from '../lib/api';

// Fallback Mock Data
const MOCK_SPECIALS = [
  {
    _id: 's1',
    title: 'Vintage Book Fair 2024',
    description: 'Exclusive glimpses from our annual vintage book fair featuring rare first editions and signed copies.',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80&auto=format&fit=crop',
    ]
  },
  {
    _id: 's2',
    title: 'Architecture & Design',
    description: 'A massive collection of architectural marvels and interior design concepts from around the globe.',
    coverImage: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=800&q=80&auto=format&fit=crop',
    images: Array(15).fill(null).map((_, i) => `https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=1600&q=80&auto=format&fit=crop&sig=${i}`)
  },
  {
    _id: 's3',
    title: 'Author Signing Event',
    description: 'Moments from our recent author meetup and book signing event in Mumbai.',
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=1600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600&q=80&auto=format&fit=crop',
    ]
  }
];

const Specials = () => {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecial, setSelectedSpecial] = useState(null);
  
  // Gallery State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailsRef = useRef(null);

  useEffect(() => {
    const fetchSpecials = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSpecials();
        if (response.data && response.data.length > 0) {
          setSpecials(response.data);
        } else {
          setSpecials(MOCK_SPECIALS);
        }
      } catch (err) {
        console.error('Failed to fetch specials, using mock:', err);
        setSpecials(MOCK_SPECIALS);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecials();
  }, []);

  // Reset index when opening a new special
  useEffect(() => {
    if (selectedSpecial) {
      setCurrentImageIndex(0);
    }
  }, [selectedSpecial]);

  // Keyboard Navigation
  useEffect(() => {
    if (!selectedSpecial) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') setSelectedSpecial(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSpecial, currentImageIndex]);

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedSpecial) return;
    const nextIndex = currentImageIndex === selectedSpecial.images.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(nextIndex);
    scrollThumbnailIntoView(nextIndex);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!selectedSpecial) return;
    const prevIndex = currentImageIndex === 0 ? selectedSpecial.images.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    scrollThumbnailIntoView(prevIndex);
  };

  const scrollThumbnailIntoView = (index) => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[index];
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  // Modal Component
  const GalleryModal = ({ special, onClose }) => {
    if (!special) return null;

    return (
      <div 
        className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300"
        onClick={onClose}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/20 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all duration-200 hover:scale-110 hover:border-white/30 group"
        >
          <FiX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Main Image Container */}
        <div className="flex-1 relative flex items-center justify-center w-full h-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none z-10"></div>
          
          <img 
            src={special.images[currentImageIndex]} 
            alt={`Gallery item ${currentImageIndex + 1}`}
            className="max-w-full max-h-[85vh] object-contain shadow-2xl transition-all duration-500 select-none animate-in zoom-in-95"
          />

          {/* Navigation Arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-32 w-16 flex items-center justify-center text-white/70 hover:text-white transition-all z-20 group focus:outline-none"
          >
            <div className="p-3 rounded-r-2xl bg-black/20 backdrop-blur-md border-y border-r border-white/10 group-hover:bg-white/10 group-hover:border-white/30 transition-all -translate-x-2 group-hover:translate-x-0">
              <FiChevronLeft size={40} />
            </div>
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-32 w-16 flex items-center justify-center text-white/70 hover:text-white transition-all z-20 group focus:outline-none"
          >
            <div className="p-3 rounded-l-2xl bg-black/20 backdrop-blur-md border-y border-l border-white/10 group-hover:bg-white/10 group-hover:border-white/30 transition-all translate-x-2 group-hover:translate-x-0">
              <FiChevronRight size={40} />
            </div>
          </button>
        </div>

        {/* Bottom Glass Panel */}
        <div 
          className="absolute bottom-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-xl border-t border-white/10 pb-6 pt-4 px-4 sm:px-8 transition-transform duration-500 animate-in slide-in-from-bottom-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            {/* Text Info */}
            <div className="flex items-end justify-between gap-4">
              <div className="flex-1 min-w-0 text-white space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight drop-shadow-lg truncate">
                  {special.title}
                </h2>
                <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed drop-shadow-md line-clamp-2 sm:line-clamp-1">
                  {special.description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/90 backdrop-blur-sm">
                  {currentImageIndex + 1} / {special.images.length}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {special.images.length > 1 && (
              <div className="relative mt-2">
                <div 
                  className="flex items-center gap-3 overflow-x-auto hide-scrollbar py-2" 
                  ref={thumbnailsRef}
                >
                  {special.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative group shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                        currentImageIndex === idx 
                          ? 'w-24 h-16 ring-2 ring-yellow-400 ring-offset-2 ring-offset-black/50 opacity-100 scale-105' 
                          : 'w-20 h-14 opacity-50 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumb ${idx}`} 
                        className="w-full h-full object-cover"
                      />
                      {/* Hover Overlay for inactive items */}
                      {currentImageIndex !== idx && (
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black font-medium">Specials</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white pb-12 pt-8 sm:pt-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-full mb-4 shadow-sm">
            <FiGift className="w-6 h-6 text-yellow-600 fill-current" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-3 tracking-tight">
            Exclusive Collections
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
            Curated specials, rare editions, and event highlights from <span className="font-semibold text-neutral-900">Indian Bookhouse</span>.
          </p>
        </div>
      </div>

      {/* Specials Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specials.map((item) => (
              <div 
                key={item._id}
                onClick={() => setSelectedSpecial(item)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 flex flex-col h-full transform hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div className="relative h-64 overflow-hidden bg-neutral-100">
                  {/* FALLBACK LOGIC: Cover Image -> First Image -> Placeholder */}
                  {item.coverImage ? (
                    <img 
                      src={item.coverImage} 
                      alt={item.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : item.images && item.images.length > 0 ? (
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                      <FiImage className="w-12 h-12 text-neutral-300" />
                    </div>
                  )}
                  
                  {/* Dark Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <FiLayers className="w-3 h-3 text-yellow-400" />
                    <span>{item.images?.length || 0} Photos</span>
                  </div>
                  
                  {/* Center View Icon on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                      <FiMaximize2 className="w-5 h-5 text-neutral-900" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-sm">
                    <span className="text-neutral-400 font-medium uppercase tracking-wider text-xs">
                      Collection
                    </span>
                    <span className="text-neutral-900 font-semibold group-hover:underline decoration-yellow-500 underline-offset-4 flex items-center gap-1">
                      View Gallery <FiChevronRight />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && specials.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-300">
            <p className="text-neutral-500">No specials available right now. Stay tuned!</p>
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {selectedSpecial && (
        <GalleryModal 
          special={selectedSpecial} 
          onClose={() => setSelectedSpecial(null)} 
        />
      )}
    </div>
  );
};

export default Specials;