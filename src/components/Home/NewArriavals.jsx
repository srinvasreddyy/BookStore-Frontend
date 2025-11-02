import React, { useState, useRef, useEffect } from 'react'
import { apiGet, addItemToCart } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from '@tanstack/react-router'
import toast from 'react-hot-toast'

const FALLBACK_BOOKS = [
  {
    id: 'n1',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 399,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=60&auto=format&fit=crop'
  },
  {
    id: 'n2',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    price: 349,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=60&auto=format&fit=crop'
  },
  {
    id: 'n3',
    title: 'Educated',
    author: 'Tara Westover',
    price: 299,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=60&auto=format&fit=crop'
  }
]

const NewArrivals = () => {
  const [added, setAdded] = useState([]) // list of added book ids
  const [adding, setAdding] = useState(new Set()) // set of ids currently being added
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function fetchNewArrivals() {
      setLoading(true)
      setError(null)
      try {
        // fetch top 6 recently added books (sorted by createdAt descending)
        const res = await apiGet('/books?sort=-createdAt&limit=6')
        const docs = res.data?.docs.reverse() || []
        const mapped = docs.map(b => ({
          id: b._id,
          title: b.title,
          author: b.author,
          price: b.price,
          image: b.coverImages?.[0] || ''
        }))
        if (!cancelled) setBooks(mapped)
      } catch (err) {
        console.error('Failed to fetch new arrivals:', err)
        setError('Failed to load new arrivals')
        // fallback to static list
        if (!cancelled) setBooks(FALLBACK_BOOKS)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchNewArrivals()
    return () => { cancelled = true }
  }, [])

  async function addToCart(id) {
    if (added.includes(id) || adding.has(id)) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate({ to: '/login' })
      return
    }
    
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
    <section className="py-5 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold text-neutral-500 max-lg:text-[9px] uppercase">Latest books</p>
          <h3 className="text-2xl max-lg:text-lg font-bold">New Arrivals</h3>
        </div>
        <div className="flex items-center gap-4">

          {/* <div className="flex items-center gap-2">
            <button className='text-sm font-semibold border px-4 py-2 rounded-md max-lg:text-xs'>See More</button>
          </div> */}
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
                  <img src={book.image} alt={book.title} className="w-full h-full object-contain" loading="lazy" />
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
                    className={`px-4 py-2 max-lg:px-3 rounded-md text-xs font-medium transition ${added.includes(book.id) ? 'bg-gray-300 text-gray-700 cursor-default' : 'bg-black text-white hover:bg-neutral-800'}`}
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

export default NewArrivals