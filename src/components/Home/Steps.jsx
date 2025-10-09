import React from 'react'
import { FiTruck, FiTag, FiUsers } from 'react-icons/fi'

const STEPS = [
  { number: '01', title: 'Shipping', subtitle: 'Worldwide shipping', icon: FiTruck },
  { number: '02', title: 'Best Price', subtitle: 'Best price with best quality', icon: FiTag },
  { number: '03', title: 'Authors', subtitle: 'Authors from around the world', icon: FiUsers },
]

const Steps = () => {
  return (
    <section className="py-12 max-lg:py-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Left heading block -> About Bookstore */}
            <div className="flex flex-col justify-center">
              <p className="text-xs  font-bold text-neutral-500 uppercase">About</p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 mt-2">About Bookstore</h2>
              <p className="text-sm max-lg:text-xs text-neutral-600 mt-4 max-w-md">Bookstore is your destination for curated books across subjects — from school textbooks to competitive exam guides and general reading. We combine great prices, fast delivery, and a handpicked selection from trusted publishers and authors.</p>
              <a href="/about" className="inline-block mt-4 px-4 w-fit py-2 bg-black text-white text-sm max-lg:text-xs rounded-md hover:bg-neutral-800">Learn more</a>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-10">
              {STEPS.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.number} className="flex items-start md:items-center gap-4">
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-neutral-700" />
                      </div>
                      <div className="text-2xl md:text-3xl font-extrabold text-neutral-900">{s.number}</div>
                    </div>

                    <div>
                      <h4 className="text-sm md:text-base font-semibold text-neutral-900">{s.title}</h4>
                      <p className="text-xs md:text-sm text-neutral-500 mt-1">{s.subtitle}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Steps