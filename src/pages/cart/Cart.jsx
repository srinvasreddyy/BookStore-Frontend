import { Link } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { getCart, addItemToCart, removeItemFromCart } from '../../lib/api';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCart();
      const cart = response.data;

      // Transform cart items to match component structure
      const transformedItems = cart.items.map(item => ({
        id: item.book._id,
        title: item.book.title,
        author: item.book.author,
        price: item.book.price,
        quantity: item.quantity,
        image: item.book.coverImages?.[0] || '', // Use first cover image
        stock: item.book.stock,
        isAvailable: item.isAvailable,
        availableStock: item.availableStock,
      }));

      setCartItems(transformedItems);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart');
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Calculate the difference to add/remove
      const currentItem = cartItems.find(item => item.id === bookId);
      if (!currentItem) return;

      const quantityDifference = newQuantity - currentItem.quantity;

      if (quantityDifference > 0) {
        // Adding items
        await addItemToCart(bookId, quantityDifference);
        toast.success('Quantity updated');
      } else if (quantityDifference < 0) {
        // For decreasing quantity, we need to remove and re-add
        // Since the API doesn't have a direct update quantity endpoint,
        // we'll remove the item and add it back with new quantity
        await removeItemFromCart(bookId);
        if (newQuantity > 0) {
          await addItemToCart(bookId, newQuantity);
        }
        toast.success('Quantity updated');
      }

      // Refresh cart data
      await fetchCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (bookId) => {
    try {
      await removeItemFromCart(bookId);
      toast.success('Item removed from cart');
      await fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 49 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchCart}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items (Left Side) */}
          <div className="lg:col-span-8 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 text-lg">Your cart is empty.</p>
                <Link to="/" className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-semibold transition-colors">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 border border-neutral-300">
                  {/* Book Image */}
                  <div className="w-16 h-24 sm:w-20 sm:h-28 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Book Details */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{item.author}</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900 mt-1 sm:mt-2">₹{item.price.toFixed(2)}</p>
                    {!item.isAvailable && (
                      <p className="text-xs text-red-600 mt-1">
                        Only {item.availableStock} left in stock
                      </p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="w-6 sm:w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={!item.isAvailable || item.quantity >= item.availableStock}
                      className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 transition-colors flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Order Summary (Right Side) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg p-6 border border-neutral-300 max-lg:border-0 sticky top-35">
              <h2 className="text-lg font-semibold mb-4 border-b pb-3 text-gray-800">Order Summary</h2>
              
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items in cart</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                      <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-900">₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4 mt-2">
                      <div className="flex justify-between font-semibold text-base">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">₹{total.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                    </div>
                  </div>

                  {/* --- FIX: Changed <a> to <Link> and added styling --- */}
                  <Link
                    to="/checkout"
                    className="block w-full text-center mt-6 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>

                  <div className="mt-5">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span>Estimated delivery:</span>
                      <span className="font-medium">3-5 business days</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;