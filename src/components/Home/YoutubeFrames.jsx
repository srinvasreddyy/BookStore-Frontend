import React, { useState, useEffect } from 'react'
import { apiGet } from '../../lib/api'

const VIDEOS = [
  {
    id: 'M7lc1UVf-VE',
    title: 'Brand Introduction — Our Story',
    channel: 'BookStore Channel'
  },
  {
    id: 'ysz5S6PUM-U',
    title: 'Top 10 Must-Read Books',
    channel: 'BookStore Channel'
  },
  {
    id: 'ScMzIvxBSi4',
    title: 'How to Choose the Right Book',
    channel: 'BookStore Channel'
  }
]

const YoutubeFrames = () => {
  const [videos, setVideos] = useState(VIDEOS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await apiGet('/homepage')
        const homepageData = response.data

        if (homepageData.youtubeVideos && homepageData.youtubeVideos.length > 0) {
          const youtubeVideos = homepageData.youtubeVideos.map(video => {
            // Extract video ID from YouTube URL
            const videoId = video.videoUrl.split('v=')[1]?.split('&')[0] ||
                           video.videoUrl.split('/').pop()?.split('?')[0] ||
                           video.videoUrl

            return {
              id: videoId,
              title: video.title,
              channel: 'BookStore Channel',
              description: video.description
            }
          })
          setVideos(youtubeVideos)
        }
      } catch (err) {
        console.error('Failed to fetch YouTube videos:', err)
        setError(err.message)
        // Keep default videos if API fails
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold text-neutral-500 uppercase">Brand video</p>
        <h2 className="text-2xl font-bold">From our YouTube</h2>
        {error && <p className="text-red-500 text-sm mt-2">Failed to load videos: {error}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v) => (
          <div key={v.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
            {/* responsive iframe wrapper */}
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                title={v.title}
                src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>

            <div className="p-4">
              <h3 className="text-sm font-semibold text-neutral-900">{v.title}</h3>
              <div className="text-xs text-neutral-500 mt-1 flex items-center justify-between">
                <span>{v.channel}</span>
                <a
                  href={`https://www.youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Watch on YouTube
                </a>
              </div>
              {v.description && (
                <p className="text-xs text-neutral-600 mt-2 line-clamp-2">{v.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default YoutubeFrames