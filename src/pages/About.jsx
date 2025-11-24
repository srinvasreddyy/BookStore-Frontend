import React from 'react'
import { FiBookOpen, FiTarget, FiHeart, FiCheckCircle, FiTrendingUp, FiBell } from 'react-icons/fi'
import founderImg from '../assets/image_91123f.png' // Assuming image name is preserved from upload

const About = () => {
  return (
    <section className="py-16 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Hero / Story Section --- */}
        <div className="text-center mb-20">
          <p className="text-3xl font-extrabold text-blue-600 uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Empowering Aspirants for a Brighter Future
          </h1>
          <div className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed space-y-4">
            <p>
              Indian Books House was founded with one mission: to make learning and exam preparation accessible to every student and aspirant in India. We are more than a platform; we are a community of learners, educators, and achievers.
            </p>
            <p>
              From central to state-level competitive exams, we provide the resources, guidance, and motivation you need to reach your career goals.
            </p>
          </div>
        </div>

        {/* --- Mission & Vision Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* Mission */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 rotate-3">
              <FiTarget className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to simplify education and bridge the gap between learners and opportunities. Whether you are preparing for UPSC, SSC, Banking, Railways, Defence, or State PSC exams, Indian Books House brings together trusted content, expert-curated materials, and the latest updates to help you succeed.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-purple-50 to-white p-10 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 -rotate-3">
              <FiHeart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become India's most trusted learning and career guidance platform for government job aspirants, empowering millions with knowledge, confidence, and success.
            </p>
          </div>
        </div>

        {/* --- What We Offer Section --- */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
            <p className="text-gray-500 mt-2">Comprehensive support for your journey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors text-center group">
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                <FiBookOpen className="w-8 h-8 text-gray-700 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Curated Study Material</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Handpicked books, notes, and online resources designed by experienced educators.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors text-center group">
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                <FiTrendingUp className="w-8 h-8 text-gray-700 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Guidance</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Learn from professionals and toppers who share proven strategies and study plans.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors text-center group">
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                <FiBell className="w-8 h-8 text-gray-700 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Job Notifications</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get real-time alerts for central and state government job vacancies.
              </p>
            </div>
          </div>
        </div>
        
        {/* --- Founder Section --- */}
        <div className="bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Founder Image */}
            <div className="relative h-[400px] lg:h-auto bg-neutral-800">
              <img 
                className="absolute inset-0 w-full h-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity duration-500"
                src={founderImg} 
                alt="Tirupati - Founder & CEO"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent lg:bg-gradient-to-r"></div>
            </div>
            
            {/* Founder Content */}
            <div className="p-10 sm:p-14 flex flex-col justify-center text-white">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs font-semibold tracking-wide uppercase">Leadership</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Tirupati</h2>
              <p className="text-blue-400 font-medium text-lg mb-6">Founder & CEO</p>
              
              <blockquote className="text-lg sm:text-xl text-gray-300 italic leading-relaxed mb-8 border-l-4 border-blue-500 pl-6">
                "Visionary behind Indian Books House, dedicated to building a knowledge-driven nation."
              </blockquote>

              <div className="space-y-4 border-t border-neutral-800 pt-8">
                <h4 className="font-bold text-gray-200">Supported By:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-white font-semibold">Academic Experts</h5>
                    <p className="text-sm text-gray-400 mt-1">Experienced teachers & authors crafting exam-focused content.</p>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">Tech & Operations</h5>
                    <p className="text-sm text-gray-400 mt-1">Ensuring a seamless experience for every learner.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Footer Call to Action --- */}
        <div className="mt-24 text-center bg-blue-50 rounded-2xl p-10 sm:p-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Join the Movement</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Indian Books House is not just a platform - it's a mission to empower aspirants across India. Together, we are building a nation of informed, capable, and confident achievers.
          </p>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
            Start Learning Today
          </button>
        </div>

      </div>
    </section>
  )
}

export default About