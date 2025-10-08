import React, { useState, useRef } from 'react'

const BOOKS = [
  {
    id: 'b1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 249,
    image: 'https://plus.unsplash.com/premium_photo-1669652639337-c513cc42ead6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'b2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 299,
    image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&q=60&auto=format&fit=crop'
  },
  {
    id: 'b3',
    title: '1984',
    author: 'George Orwell',
    price: 199,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=60&auto=format&fit=crop'
  },
  {
    id: 'b4',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    price: 349,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=60&auto=format&fit=crop'
  },
  {
    id: 'b5',
    title: 'Pride & Prejudice',
    author: 'Jane Austen',
    price: 229,
    image: 'https://plus.unsplash.com/premium_photo-1715107534067-040e38ee7049?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'b6',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    price: 179,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=60&auto=format&fit=crop'
  }
]

const BestPublications = () => {
  const [added, setAdded] = useState([]) // list of added book ids
  const containerRef = useRef(null)

  function addToCart(id) {
    if (added.includes(id)) return
    setAdded(prev => [...prev, id])
    // TODO: connect to real cart/context
  }

  // number of pages (each page equals container clientWidth scroll)
  function scrollNext() {
    const el = containerRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.9
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
  function scrollPrev() {
    const el = containerRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.9
    el.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }

  // no autoplay or automatic paging; manual controls only

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-neutral-500 max-lg:text-[9px] uppercase">Best sellers</p>
          <h3 className="text-2xl max-lg:text-lg font-bold">Best Publications</h3>
        </div>
        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2">
   
            <button className='text-sm font-semibold border px-4 py-2 rounded-md max-lg:text-xs'>See More</button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-x-auto scroll-smooth hide-scrollbar"
      >
        <div className="flex gap-6 pb-4">
          {BOOKS.map(book => (
            <article key={book.id} className="min-w-[220px] md:min-w-[260px] lg:min-w-[280px] bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="w-full h-44 bg-gray-100">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-2">{book.title}</h4>
                <div className="text-xs text-neutral-600 mb-2">{book.author}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-lg font-bold text-neutral-900">₹{book.price}</div>
                  <button
                    onClick={() => addToCart(book.id)}
                    disabled={added.includes(book.id)}
                    className={`px-4 py-2  max-lg:px-3  rounded-md text-xs font-medium transition ${added.includes(book.id) ? 'bg-gray-300 text-gray-700 cursor-default' : 'bg-black text-white hover:bg-neutral-800'}`}
                  >
                    {added.includes(book.id) ? 'Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* no indicators or autoplay; manual scroll only */}
    </section>
  )
}

export default BestPublications