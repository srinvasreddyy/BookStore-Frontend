import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiDownload, FiX, FiFileText, FiHeart } from 'react-icons/fi';
import { apiGet } from '../lib/api';
import { Link } from '@tanstack/react-router';

const FreeContent = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchFreeContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiGet('/free-content');
        setPdfs(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Failed to fetch free content:', err);
        setPdfs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFreeContent();
  }, []);

  const PdfReader = ({ pdf, onClose }) => {
    if (!pdf) return null;

    // Ensure HTTPS
    const secureUrl = pdf.pdfUrl ? pdf.pdfUrl.replace(/^http:\/\//i, 'https://') : '';

    return (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ 
          background: 'rgba(0, 0, 0, 0.75)', 
          backdropFilter: 'blur(8px)' 
        }}
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-5xl h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800 truncate pr-4">{pdf.title}</h3>
            <div className="flex items-center gap-2">
              <a 
                href={secureUrl} 
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                title="Download PDF"
              >
                <FiDownload size={20} />
              </a>
              <button 
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 bg-gray-100 relative">
            {secureUrl ? (
              <iframe
                src={`${secureUrl}#toolbar=0&view=FitH`}
                title="PDF Reader"
                className="w-full h-full border-none"
                type="application/pdf" 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Invalid PDF URL
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-10 text-center px-4">
        <div className="inline-flex p-3 bg-red-50 rounded-full text-red-500 mb-4">
          <FiHeart size={24} fill="currentColor" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Free Knowledge</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Access our curated collection of free educational resources.</p>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : pdfs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            No content available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pdfs.map((pdf) => (
              <div key={pdf._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                  {pdf.coverImage ? (
                    <img src={pdf.coverImage} alt={pdf.title} className="w-full h-full object-cover" />
                  ) : (
                    <FiFileText size={48} className="text-gray-300" />
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-end justify-start p-4">
                    <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                      <FiBookOpen /> Read
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{pdf.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{pdf.description}</p>
                  <button 
                    onClick={() => setSelectedPdf(pdf)}
                    className="mt-auto w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Read Now</span>
                    <FiBookOpen size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPdf && <PdfReader pdf={selectedPdf} onClose={() => setSelectedPdf(null)} />}
    </div>
  );
};

export default FreeContent;