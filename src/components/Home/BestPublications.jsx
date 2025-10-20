import React, { useState, useRef, useEffect } from 'react'
import { apiGet, addItemToCart } from '../../lib/api'
import toast from 'react-hot-toast'

const FALLBACK_BOOKS = [
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
  }
]

const BestPublications = () => {
  const [added, setAdded] = useState([]) // list of added book ids
  const [adding, setAdding] = useState(new Set()) // set of ids currently being added
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function fetchBestsellers() {
      setLoading(true)
      setError(null)
      try {
        // fetch top 6 bestsellers
        const res = await apiGet('/books?isBestSeller=true&limit=6')
        const docs = res.data?.docs || []
        const mapped = docs.map(b => ({
          id: b._id,
          title: b.title,
          author: b.author,
          price: b.price,
          image: b.coverImages?.[0] || ''
        }))
        if (!cancelled) setBooks(mapped)
      } catch (err) {
        console.error('Failed to fetch bestsellers:', err)
        setError('Failed to load bestsellers')
        // fallback to static list
        if (!cancelled) setBooks(FALLBACK_BOOKS)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchBestsellers()
    return () => { cancelled = true }
  }, [])

  async function addToCart(id) {
    if (added.includes(id) || adding.has(id)) return
    // optimistic UI: mark as adding
    setAdding(prev => new Set(prev).add(id))
    try {
      await addItemToCart(id, 1)
      setAdded(prev => [...prev, id])
      toast.success('Added to cart')
      // Notify other parts of the app (e.g. NavBar) that cart changed
      try { window.dispatchEvent(new CustomEvent('cart-updated')) } catch (e) { /* ignore */ }
    } catch (err) {
      console.error('Add to cart failed:', err)
      // If unauthorized, show login hint
      const msg = err?.message || 'Failed to add to cart'
      toast.error(msg)
    } finally {
      setAdding(prev => {
        const s = new Set(prev)
        s.delete(id)
        return s
      })
    }
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
          {loading && (
            <div className="flex items-center justify-center w-full py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          )}

          {!loading && books.map(book => (
            <a href={`/product/${book.id}`} key={book.id} className="min-w-[220px] md:min-w-[260px] lg:min-w-[280px] bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="w-full h-44 bg-gray-100">
                {book.image ? (
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">No image</div>
                )}
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-2">{book.title}</h4>
                <div className="text-xs text-neutral-600 mb-2">{book.author}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-lg font-bold text-neutral-900">₹{book.price}</div>
                  <button
                    onClick={(e) => { e.preventDefault(); addToCart(book.id) }}
                    disabled={added.includes(book.id)}
                    className={`px-4 py-2  max-lg:px-3  rounded-md text-xs font-medium transition ${added.includes(book.id) ? 'bg-gray-300 text-gray-700 cursor-default' : 'bg-black text-white hover:bg-neutral-800'}`}
                  >
                    {added.includes(book.id) ? 'Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600">{error}</div>
      )}
    </section>
  )
}

export default BestPublications