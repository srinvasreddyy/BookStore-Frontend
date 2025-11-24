import React, { useState, useEffect } from 'react'
import { RiBookOpenLine } from 'react-icons/ri'
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa'
import { getContactDetails } from '../lib/api'
import logo1 from '../assets/logo1.png'

const Footer = () => {
  const [contactData, setContactData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await getContactDetails()
        setContactData(response.data)
      } catch (error) {
        console.error('Failed to fetch contact data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContactData()
  }, [])

  const formatAddress = (address) => {
    if (!address) return '891 Hyderabad, Hyderabad, Telangana, 500000, India'
    
    const parts = []
    if (address.street) parts.push(address.street)
    if (address.city || address.state) {
      parts.push([address.city, address.state].filter(Boolean).join(', '))
    }
    if (address.zipCode || address.country) {
      parts.push([address.zipCode, address.country].filter(Boolean).join(', '))
    }
    
    return parts.length > 0 ? parts.join(', ') : '891 Hyderabad, Hyderabad, Telangana, 500000, India'
  }

  return (
    <footer className="bg-black text-black pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand / about */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-10 rounded-full p-1 overflow-hidden">
                <img src={logo1} alt="BookStore Logo" className="h-8 w-8 object-cover " />
              </div>
              <div>
                <div className="text-xl text-white font-bold">Indian Books House</div>
                <div className="text-sm text-neutral-400">Knowledge for nation building</div>
              </div>
            </div>
            <p className="text-sm text-neutral-400">A curated collection of short videos and quick previews to help you find your next read. Follow us for updates and new arrivals.</p>

            <div className="flex items-center space-x-3">
              <a 
                aria-label="Facebook" 
                href={contactData?.socialMedia?.facebook || '#'} 
                className="p-2 rounded bg-white bg-opacity-5 hover:bg-opacity-10 text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a 
                aria-label="Instagram" 
                href={contactData?.socialMedia?.instagram || '#'} 
                className="p-2 rounded bg-white bg-opacity-5 hover:bg-opacity-10 text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a 
                aria-label="Telegram" 
                href={contactData?.socialMedia?.telegram || '#'} 
                className="p-2 rounded bg-white bg-opacity-5 hover:bg-opacity-10 text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegramPlane />
              </a>
              <a 
                aria-label="WhatsApp" 
                href={contactData?.socialMedia?.whatsapp || '#'} 
                className="p-2 rounded bg-white bg-opacity-5 hover:bg-opacity-10 text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-neutral-100">Explore</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/products/all" className="hover:text-white">Categories</a></li>
              <li><a href="#best-publications" className="hover:text-white">Best Publications</a></li>
              <li><a href="#videos" className="hover:text-white">Videos</a></li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-neutral-100">Customer Service</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><a href="#" className="hover:text-white">Help & FAQs</a></li>
              <li><a href="#" className="hover:text-white">Shipping </a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-neutral-100">Contact</h4>
            <div className="flex items-start gap-2 text-sm text-neutral-300 mb-3">
              <FiMapPin className="mt-1 flex-shrink-0" />
              <div>{formatAddress(contactData?.address)}</div>
            </div>
            <div className="flex items-start gap-2 text-sm text-neutral-300 mb-3">
              <FiPhone className="mt-1 flex-shrink-0" />
              <div>
                <a 
                  href={`tel:${contactData?.phone || '+919999999999'}`} 
                  className="hover:text-white"
                >
                  {contactData?.phone || '+91 9999999999'}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-neutral-300 mb-3">
              <FiMail className="mt-1 flex-shrink-0" />
              <div>
                <a 
                  href={`mailto:${contactData?.email || 'admin@indianbookshouse.in'}`} 
                  className="hover:text-white"
                >
                  {contactData?.email || 'admin@indianbookshouse.in'}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-neutral-300 mb-4">
              <FiClock className="mt-1 flex-shrink-0" />
              <div>{contactData?.businessHours || 'Mon-Sat 9:00 - 12:00'}</div>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <label htmlFor="newsletter" className="sr-only">Email address</label>
              <input id="newsletter" type="email" placeholder="Your email" className="w-full px-3 py-2 rounded bg-white text-black placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/30" />
              <button type="submit" className="px-3 py-2 bg-white hover:bg-gray-200 rounded text-black text-sm font-medium transition-colors">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-6 pb-6 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between">
          <div>© {new Date().getFullYear()} Indian Books House. All rights reserved.</div>
          <div className="mt-3 md:mt-0">Designed and Developed by <a href="https://kribudwebtech.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kribudwebtech</a></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer