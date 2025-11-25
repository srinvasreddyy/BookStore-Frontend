import React, { useState, useEffect } from 'react'
import { FiMail, FiPhone, FiMapPin, FiClock, FiArrowRight, FiSend } from 'react-icons/fi'
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

  const SocialLink = ({ href, icon: Icon, label }) => (
    <a
      href={href || '#'}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative flex items-center justify-center w-10 h-10 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 transition-all duration-300 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
      <Icon className="relative z-10 w-4 h-4 text-neutral-400 group-hover:text-black transition-colors duration-300" />
    </a>
  )

  const FooterLink = ({ href, children }) => (
    <li>
      <a 
        href={href} 
        className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-all duration-300"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 group-hover:bg-white transition-colors duration-300"></span>
        <span className="relative overflow-hidden">
          {children}
          <span className="absolute bottom-0 left-0 w-full h-px bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        </span>
        <FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </a>
    </li>
  )

  return (
    <footer className="relative bg-black text-white pt-20 pb-10 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-neutral-700 to-black opacity-50"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-neutral-900/50 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 -left-20 w-72 h-72 bg-neutral-900/30 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6 transform transition-all duration-500 hover:translate-x-1">
            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-neutral-600 to-neutral-800 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-black rounded-lg p-2 border border-neutral-800">
                  <img src={logo1} alt="Logo" className="h-8 w-8 object-contain" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-wide">Indian Books House</h2>
                <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-medium">Knowledge for nation</p>
              </div>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed pr-4">
              Curating the finest collection of books and educational resources. Empowering minds, one page at a time.
            </p>
            <div className="flex gap-3">
              <SocialLink href={contactData?.socialMedia?.facebook} icon={FaFacebookF} label="Facebook" />
              <SocialLink href={contactData?.socialMedia?.instagram} icon={FaInstagram} label="Instagram" />
              <SocialLink href={contactData?.socialMedia?.telegram} icon={FaTelegramPlane} label="Telegram" />
              <SocialLink href={contactData?.socialMedia?.whatsapp} icon={FaWhatsapp} label="WhatsApp" />
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              Explore
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-white rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/products/all">Categories</FooterLink>
              <FooterLink href="#best-publications">Best Sellers</FooterLink>
              <FooterLink href="#videos">Video Reviews</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-white rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="#">Shipping Policy</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold relative inline-block">
              Stay Connected
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-white rounded-full"></span>
            </h3>
            
            <div className="space-y-4">
              <div className="group flex items-start gap-3 text-sm text-neutral-400 hover:text-white transition-colors duration-300">
                <FiMapPin className="mt-1 shrink-0 group-hover:text-white transition-colors" />
                <span className="leading-relaxed">{formatAddress(contactData?.address)}</span>
              </div>
              <div className="group flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors duration-300">
                <FiPhone className="shrink-0 group-hover:text-white transition-colors" />
                <a href={`tel:${contactData?.phone}`} className="hover:underline decoration-1 underline-offset-4">
                  {contactData?.phone || '+91 9999999999'}
                </a>
              </div>
              <div className="group flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors duration-300">
                <FiMail className="shrink-0 group-hover:text-white transition-colors" />
                <a href={`mailto:${contactData?.email}`} className="hover:underline decoration-1 underline-offset-4">
                  {contactData?.email || 'admin@indianbookshouse.in'}
                </a>
              </div>
            </div>

            {/* Creative Newsletter Input */}
            <form onSubmit={(e) => e.preventDefault()} className="relative group mt-6">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-neutral-900/50 border border-neutral-800 text-sm text-white px-4 py-3 rounded-lg focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all duration-300 placeholder:text-neutral-600"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 p-2 bg-white text-black rounded-md hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <FiSend className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="hover:text-neutral-400 transition-colors">
            &copy; {new Date().getFullYear()} Indian Books House. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <p className="flex items-center gap-1">
              Developed by 
              <a 
                href="https://kribudwebtech.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-white font-medium relative after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-px after:bg-white hover:after:w-full after:transition-all after:duration-300"
              >
                Kribudwebtech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer