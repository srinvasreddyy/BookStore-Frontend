import React, { useEffect, useRef, useState } from 'react'
import { apiGet } from '../../lib/api'

// Simple carousel where each slide is an image wrapped in a link.
// Tailwind utilities are used for styling (project should have Tailwind configured).

const HeroC = ({ slides: propSlides, autoPlay = true, autoPlayInterval = 4000 }) => {
  const [slides, setSlides] = useState(propSlides || [])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true)
        const response = await apiGet('/homepage')
        const homepageData = response.data

        if (homepageData.carouselImages && homepageData.carouselImages.length > 0) {
          const carouselSlides = homepageData.carouselImages.map(img => ({
            src: img.imageUrl,
            alt: img.title,
            href: img.bookLink ? `/books/${img.bookLink._id || img.bookLink}` : '#books',
            title: img.title,
            subtitle: img.subtitle
          }))
          setSlides(carouselSlides)
        } else {
          setSlides([])
        }
      } catch (err) {
        console.error('Failed to fetch carousel images:', err)
        setError(err.message)
        setSlides([])
      } finally {
        setLoading(false)
      }
    }

    if (!propSlides) {
      fetchSlides()
    }
  }, [propSlides])

  useEffect(() => {
    if (!autoPlay || paused || slides.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, autoPlayInterval)
    return () => clearInterval(timerRef.current)
  }, [autoPlay, paused, autoPlayInterval, slides.length])

  useEffect(() => {
    // keep index in bounds if slides change
    if (index >= slides.length) setIndex(0)
  }, [slides.length])

  // keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setIndex((i) => (i + 1) % slides.length)

  // Don't render anything if no slides and not loading
  if (!loading && slides.length === 0) return null

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
                {/* Optional caption area */}
                {(s.title || s.subtitle) && (
                  <div className="absolute left-4 bottom-4 bg-black/60 text-white px-3 py-2 rounded max-w-xs">
                    {s.title && <div className="font-semibold text-sm">{s.title}</div>}
                    {s.subtitle && <div className="text-xs mt-1">{s.subtitle}</div>}
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Controls */}
        {slides.length > 1 && (
          <>
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
          </>
        )}

        {/* API status badge (dev aid) */}
        <div className="absolute left-3 bottom-3 text-xs bg-white/90 text-neutral-800 px-2 py-1 rounded shadow">
          {error ? `API error: ${error}` : loading ? 'Loading...' : 'API OK'}
        </div>
      </div>
    </section>
  )
}

export default HeroC