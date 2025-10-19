import React, { useEffect, useRef, useState } from 'react'
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { RiBookOpenLine } from 'react-icons/ri'
import { apiGet } from '../../lib/api'

// Videos section: responsive grid of short, auto-playing videos.
// Notes:
// - Replace the sample `src` urls in `videos` with Pexels video file URLs (or your own hosted videos).
// - Autoplaying unmuted videos is blocked by browsers, so videos start muted and loop.

const Videos = () => {
  const [videos, setVideos] = useState([])
  const containerRef = useRef(null)
  const [playingMap, setPlayingMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await apiGet('/homepage')
        const homepageData = response.data

        if (homepageData.shortVideos && homepageData.shortVideos.length > 0) {
          const shortVideos = homepageData.shortVideos.map((video, index) => ({
            id: video._id || index + 1,
            src: video.videoUrl,
            poster: '',
            title: video.title,
            description: video.description,
            duration: video.duration
          }))
          setVideos(shortVideos)
        } else {
          setVideos([])
        }
      } catch (err) {
        console.error('Failed to fetch short videos:', err)
        setError(err.message)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // play when at least half visible
    }

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target
        try {
          if (entry.isIntersecting) {
            video.play().catch(() => {})
            setPlayingMap((m) => ({ ...m, [video.dataset.id]: true }))
          } else {
            video.pause()
            setPlayingMap((m) => ({ ...m, [video.dataset.id]: false }))
          }
        } catch (e) {
          // ignore play/pause exceptions
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    const container = containerRef.current
    if (container) {
      const vids = container.querySelectorAll('video[data-id]')
      vids.forEach((v) => observer.observe(v))
    }

    return () => observer.disconnect()
  }, [videos])

  const togglePlay = (ev, id) => {
    const video = ev.currentTarget.closest('.video-card').querySelector('video')
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
      setPlayingMap((m) => ({ ...m, [id]: true }))
    } else {
      video.pause()
      setPlayingMap((m) => ({ ...m, [id]: false }))
    }
  }

  const toggleMute = (ev, id) => {
    const video = ev.currentTarget.closest('.video-card').querySelector('video')
    if (!video) return
    video.muted = !video.muted
    // update state so UI can reflect unmuted (optional)
    setPlayingMap((m) => ({ ...m, [`muted_${id}`]: video.muted }))
  }

  // Don't render anything if no videos and not loading
  if (!loading && videos.length === 0) return null

  return (
    <section className="py-10 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold max-lg:text-2xl max-lg:mb-1 mb-4 text-gray-800">Short Videos</h2>
        <p className="text-gray-600 mb-6  max-lg:text-xs">Quick previews and short clips from our bookstore.</p>
        {error && <p className="text-red-500 text-sm mb-4">Failed to load videos: {error}</p>}

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">Browse shorts</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const el = containerRef.current
                if (!el) return
                const scrollAmount = el.clientWidth * 0.9
                el.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
              }}
              aria-label="Previous"
              className="bg-white p-2 rounded shadow flex items-center justify-center"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => {
                const el = containerRef.current
                if (!el) return
                const scrollAmount = el.clientWidth * 0.9
                el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
              }}
              aria-label="Next"
              className="bg-white p-2 rounded shadow flex items-center justify-center"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full overflow-x-auto scroll-smooth hide-scrollbar"
        >
          <div className="flex gap-6 pb-4">
            {videos.map((v) => (
              <article key={v.id} className="video-card min-w-[260px] md:min-w-[320px] lg:min-w-[360px] bg-black rounded-lg overflow-hidden shadow-lg">
                  <div className="w-full h-96 relative flex items-center justify-center">
                    {/* theme badge (replaces per-video title) */}
                    <div className="absolute z-30 top-3 left-3 bg-black bg-opacity-60 text-white rounded-full px-3 py-1 flex items-center gap-2">
                      <RiBookOpenLine className="w-4 h-4" />
                      <span className="text-xs font-semibold">{v.title || 'BookStore'}</span>
                    </div>
                  <video
                    data-id={v.id}
                    className="w-full h-full object-cover bg-gray-200"
                    src={v.src}
                    poster={v.poster}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={`Short video ${v.title || v.id}`}
                  />

                  {/* minimal overlay controls (bottom-right) */}
                  <div className="absolute z-20 bottom-3 right-3 flex flex-col items-end space-y-2">
                    <button
                      onClick={(e) => togglePlay(e, v.id)}
                      aria-label={playingMap[v.id] ? 'Pause video' : 'Play video'}
                      className="bg-black bg-opacity-60 text-white p-2 rounded-full shadow hover:bg-opacity-80 w-10 h-10 flex items-center justify-center"
                    >
                      {playingMap[v.id] ? <FiPause /> : <FiPlay />}
                    </button>
                    <button
                      onClick={(e) => toggleMute(e, v.id)}
                      aria-label="Toggle mute"
                      className="bg-black bg-opacity-60 text-white p-2 rounded-full shadow hover:bg-opacity-80 w-10 h-10 flex items-center justify-center"
                    >
                      {playingMap[`muted_${v.id}`] === false ? <FiVolume2 /> : <FiVolumeX />}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Videos