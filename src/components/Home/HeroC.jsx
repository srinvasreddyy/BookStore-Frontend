import React, { useEffect, useRef, useState } from 'react'
import { apiGet } from '../../lib/api'

// Simple carousel where each slide is an image wrapped in a link.
// Tailwind utilities are used for styling (project should have Tailwind configured).
const DEFAULT_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=60&auto=format&fit=crop',
    alt: 'Stack of books on a table',
    href: '#books',
  },
  {
    src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=60&auto=format&fit=crop',
    alt: 'Person reading a book outdoors',
    href: '#reading',
  },
  {
    src: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&q=60&auto=format&fit=crop',
    alt: 'Bookshelf filled with colorful books',
    href: '#shelf',
  },
]

const HeroC = ({ slides = DEFAULT_SLIDES, autoPlay = true, autoPlayInterval = 4000 }) => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)
  const length = slides.length
  const timerRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    if (!autoPlay || paused || length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % length)
    }, autoPlayInterval)
    return () => clearInterval(timerRef.current)
  }, [autoPlay, paused, autoPlayInterval, length])

  useEffect(() => {
    apiGet('/healthcheck')
      .then((data) => setHealth(data))
       .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    // keep index in bounds if slides change
    if (index >= length) setIndex(0)
  }, [length])

  // keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const prev = () => setIndex((i) => (i - 1 + length) % length)
  const next = () => setIndex((i) => (i + 1) % length)

  if (length === 0) return null

  return (
    <section className="w-full">
      <div
        className="relative w-full mx-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides container */}
        <div className="overflow-hidden ">
          <div
            ref={trackRef}
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s, i) => (
              <a
                key={i}
                href={s.href || '#'}
                className="shrink-0 w-full block relative"
                aria-hidden={index !== i}
                target={s.href && s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href && s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <img
                  src={s.src}
                  alt={s.alt || `Slide ${i + 1}`}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover block"
                />
                {/* Optional caption area - hidden by default */}
                {s.caption && (
                  <div className="absolute left-4 bottom-4 bg-black/60 text-white px-3 py-2 rounded">
                    {s.caption}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Controls */}
        <button
          aria-label="Previous slide"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white px-2 py-2 rounded-full shadow-md"
        >
          ‹
        </button>
        <button
          aria-label="Next slide"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white px-2 py-2 rounded-full shadow-md"
        >
          ›
        </button>

        {/* Indicators */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={index === i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full ${index === i ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>

        {/* API status badge (dev aid) */}
        <div className="absolute left-3 bottom-3 text-xs bg-white/90 text-neutral-800 px-2 py-1 rounded shadow">
          {error ? `API error: ${error}` : health ? (health.message || 'API OK') : 'Connecting to API...'}
        </div>
      </div>
    </section>
  )
}

export default HeroC