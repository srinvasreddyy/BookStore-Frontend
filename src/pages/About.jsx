import React from 'react'
import { FiBookOpen, FiTarget, FiHeart } from 'react-icons/fi'

// You can replace this with your actual team data
const TEAM_MEMBERS = [
  { name: 'Jane Doe', role: 'Founder & CEO', imageUrl: 'https://i.pravatar.cc/150?u=jane' },
  { name: 'John Smith', role: 'Head of Curation', imageUrl: 'https://i.pravatar.cc/150?u=john' },
  { name: 'Emily White', role: 'Marketing Director', imageUrl: 'https://i.pravatar.cc/150?u=emily' },
]

const About = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-neutral-500 uppercase">Our Story</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 mt-2">
            Connecting Readers with Stories
          </h1>
          <p className="text-sm md:text-base text-neutral-600 mt-4 max-w-3xl mx-auto">
            Founded with a passion for literature, Bookstore is more than just a place to buy books. It's a community for readers, a platform for authors, and a space where stories come to life.
          </p>
        </div>

        {/* --- Main Content: Mission and Vision --- */}
        <div className="bg-white rounded-lg p-8 max-lg:p-5 border max-lg:border-0 border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Image Block */}
            <div className="order-last md:order-first">
              <img 
                className="rounded-lg object-cover w-full h-[500px] shadow-md"
                src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop" 
                alt="A hand reaching for a book on a library shelf"
              />
            </div>
            
            {/* Text Content Block */}
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">Our Mission</h2>
              <p className="text-sm text-neutral-600 mt-4">
                Our mission is to make knowledge and stories accessible to everyone, everywhere. We curate a diverse collection of books, from timeless classics to contemporary bestsellers, ensuring there's something for every reader. We believe in the power of books to inspire, educate, and transform lives.
              </p>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                    <FiBookOpen className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-neutral-900">Curated Selection</h4>
                    <p className="text-sm text-neutral-500 mt-1">Every book is handpicked by our team of passionate readers and experts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                    <FiTarget className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-neutral-900">Author Support</h4>
                    <p className="text-sm text-neutral-500 mt-1">We champion both established and emerging authors from around the globe.</p>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                    <FiHeart className="w-5 h-5 text-neutral-700" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-neutral-900">Community Focused</h4>
                    <p className="text-sm text-neutral-500 mt-1">Building a vibrant community for book lovers is at the heart of what we do.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* --- Meet the Team Section --- */}
        <div className="mt-20 text-center">
          <p className="text-xs font-bold text-neutral-500 uppercase">The Team</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-2">Meet Our Passionate Curators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="bg-white rounded-lg p-6 text-center border border-neutral-200 transition-transform hover:scale-105">
                <img 
                  className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-neutral-100" 
                  src={member.imageUrl} 
                  alt={member.name} 
                />
                <h4 className="text-lg font-semibold text-neutral-900 mt-4">{member.name}</h4>
                <p className="text-sm text-neutral-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default About