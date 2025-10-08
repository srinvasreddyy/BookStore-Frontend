import React from 'react'

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
  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold text-neutral-500 uppercase">Brand video</p>
        <h2 className="text-2xl font-bold">From our YouTube</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {VIDEOS.map((v) => (
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
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default YoutubeFrames