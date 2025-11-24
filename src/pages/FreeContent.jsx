import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { FiBookOpen, FiDownload, FiX, FiFileText, FiHeart } from 'react-icons/fi';
import { apiGet } from '../lib/api';

// Fallback data to show UI structure if backend is empty/failing
const MOCK_PDFS = [
  {
    _id: '1',
    title: 'The Art of Storytelling',
    description: 'A comprehensive guide to crafting compelling narratives and mastering the art of storytelling.',
    author: 'Indian Bookhouse',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80&auto=format&fit=crop'
  },
  {
    _id: '2',
    title: 'Literary Classics Collection',
    description: 'An introduction to timeless classics that have shaped the world of literature.',
    author: 'Indian Bookhouse',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    coverImage: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80&auto=format&fit=crop'
  },
  {
    _id: '3',
    title: 'Modern Philosophy Primer',
    description: 'Explore the fundamental concepts of modern philosophy in this concise digest.',
    author: 'Indian Bookhouse',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80&auto=format&fit=crop'
  }
];

const FreeContent = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null); // For the reader modal

  useEffect(() => {
    const fetchFreeContent = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace '/free-content' with your actual backend endpoint
        const response = await apiGet('/free-content');
        if (response.data && response.data.length > 0) {
          setPdfs(response.data);
        } else {
          // Use mock data if API returns empty (for demo purposes)
          setPdfs(MOCK_PDFS);
        }
      } catch (err) {
        console.error('Failed to fetch free content:', err);
        // Fallback to mock data on error so UI is visible
        setPdfs(MOCK_PDFS);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeContent();
  }, []);

  // PDF Reader Modal Component
  const PdfReader = ({ pdf, onClose }) => {
    if (!pdf) return null;

    // Handle click on backdrop to close
    const handleBackdropClick = (e) => {
      e.stopPropagation();
      onClose();
    };

    // Prevent closing when clicking inside the modal
    const handleModalClick = (e) => {
      e.stopPropagation();
    };

    return (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl p-4"
        onClick={handleBackdropClick}
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(20, 20, 40, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        {/* Glassmorphic Modal Container */}
        <div 
          className="rounded-3xl shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in duration-300 border border-white/20"
          onClick={handleModalClick}
          style={{
            width: '75vw',
            height: '75vh',
            maxWidth: '95vw',
            maxHeight: '95vh',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: `
              0 8px 32px 0 rgba(31, 38, 135, 0.37),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
              inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)
            `
          }}
        >
          {/* Reader Header - Glassmorphic */}
          <div 
            className="px-6 py-4 flex items-center justify-between shrink-0 border-b border-white/10"
            style={{
              background: 'rgba(30, 30, 50, 0.4)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400/30 to-yellow-500/20 border border-yellow-400/30">
                <FiFileText className="text-yellow-300 w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm truncate max-w-[200px] sm:max-w-md text-white/90">
                {pdf.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href={pdf.pdfUrl} 
                download 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-lg transition-all text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/30"
                title="Download"
              >
                <FiDownload size={18} />
              </a>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg transition-all text-gray-300 hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-400/30"
                title="Close"
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          {/* Reader Content */}
          <div className="flex-1 relative w-full h-full overflow-hidden">
            <iframe
              src={`${pdf.pdfUrl}#toolbar=0&view=FitH`} 
              className="w-full h-full border-none bg-white" 
              title="PDF Reader"
              type="application/pdf"
              allow="fullscreen"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
            
            {/* Background Loading Spinner */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white/60 mb-3"></div>
              <p className="text-sm text-white/60">Loading Document...</p>
            </div>
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
            <span className="text-black font-medium">Free Content</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white pb-12 pt-8 sm:pt-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-4">
            <FiHeart className="w-6 h-6 text-red-500 fill-current" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-3 tracking-tight">
            Knowledge for Everyone
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
            Free content provided by the <span className="font-semibold text-neutral-900">Indian Bookhouse</span> with love.
          </p>
        </div>
      </div>

      {/* Content Grid */}
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
            {pdfs.map((pdf) => (
              <div 
                key={pdf._id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 flex flex-col"
              >
                {/* Card Image Area */}
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  {pdf.coverImage ? (
                    <img 
                      src={pdf.coverImage} 
                      alt={pdf.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                      <FiFileText className="w-12 h-12 text-neutral-300" />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  
                  {/* Floating Icon */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                    <FiBookOpen className="w-5 h-5 text-neutral-900" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {pdf.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
                    {pdf.description || "Unlock knowledge with this free resource specially curated for you."}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Free Resource
                    </span>
                    <button
                      onClick={() => setSelectedPdf(pdf)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors transform active:scale-95"
                    >
                      <span>Read Now</span>
                      <FiBookOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && pdfs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-neutral-300">
            <p className="text-neutral-500">No free content available at the moment. Please check back soon!</p>
          </div>
        )}
      </div>

      {/* PDF Reader Overlay */}
      {selectedPdf && (
        <PdfReader 
          pdf={selectedPdf} 
          onClose={() => setSelectedPdf(null)} 
        />
      )}
    </div>
  );
};

export default FreeContent;