import { Link, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { getCart, addItemToCart, removeItemFromCart, validateCoupon, apiGet } from '../../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Discount related state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch cart data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

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
      if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
        setError('Please log in to view your cart');
        toast.error('Please log in to view your cart');
      } else {
        setError('Failed to load cart');
        toast.error('Failed to load cart');
      }
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

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (subtotal === 0) {
      toast.error('Add items to cart before applying coupon');
      return;
    }

    try {
      setDiscountLoading(true);
      const response = await validateCoupon(couponCode.trim(), subtotal);
      const discount = response.data;

      // Check if discount is applicable
      if (discount.minCartValue && subtotal < discount.minCartValue) {
        toast.error(`Minimum cart value of ₹${discount.minCartValue} required`);
        return;
      }

      setAppliedDiscount(discount);
      setCouponCode('');
      toast.success('Coupon applied successfully!');
    } catch (err) {
      console.error('Failed to apply coupon:', err);
      toast.error(err.message || 'Invalid coupon code');
    } finally {
      setDiscountLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedDiscount(null);
    toast.success('Coupon removed');
  };

  const fetchAvailableDiscounts = async () => {
    try {
      setOffersLoading(true);
      const response = await apiGet('/discounts/available');
      setAvailableDiscounts(response.data || []);
    } catch (err) {
      console.error('Failed to fetch available discounts:', err);
      toast.error('Failed to load available offers');
      // Fallback to empty array if API fails
      setAvailableDiscounts([]);
    } finally {
      setOffersLoading(false);
    }
  };

  const openOffersModal = () => {
    setShowOffersModal(true);
    fetchAvailableDiscounts();
  };

  const applyDiscountFromModal = (discount) => {
    setCouponCode(discount.couponCode);
    setShowOffersModal(false);
    // Auto-apply the discount
    setTimeout(() => applyCoupon(), 100);
  };

  const calculateDiscountAmount = (discount, cartSubtotal) => {
    if (discount.type === 'PERCENTAGE') {
      return (cartSubtotal * discount.value) / 100;
    } else if (discount.type === 'FIXED_AMOUNT') {
      return Math.min(discount.value, cartSubtotal); // Don't exceed cart total
    } else if (discount.type === 'FREE_DELIVERY') {
      return shipping; // Free delivery means no shipping cost
    }
    return 0;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 49 : 0;
  const discountAmount = appliedDiscount ? calculateDiscountAmount(appliedDiscount, subtotal) : 0;
  const total = subtotal + shipping - discountAmount;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 " >
          {/* Cart Items (Left Side) */}
          <div className="lg:col-span-8 px-4 space-y-4">
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

                    {/* Discount Section */}
                    <div className="border-t pt-3">
                      <div className="space-y-3">
                        {!appliedDiscount ? (
                          <>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Enter coupon code"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                              />
                              <button
                                onClick={applyCoupon}
                                disabled={discountLoading || !couponCode.trim()}
                                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {discountLoading ? 'Applying...' : 'Apply'}
                              </button>
                            </div>
                            <div className="text-center">
                              <button
                                onClick={openOffersModal}
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                              >
                                View Available Offers
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="bg-green-50 border border-green-200 rounded-md p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-800">
                                  {appliedDiscount.couponCode} Applied
                                </p>
                                <p className="text-xs text-green-600">
                                  {appliedDiscount.description}
                                </p>
                              </div>
                              <button
                                onClick={removeCoupon}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}

                        {appliedDiscount && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount ({appliedDiscount.couponCode})</span>
                            <span className="font-medium">
                              -₹{discountAmount.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
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
                    state={{
                      appliedDiscount,
                      discountAmount,
                      subtotal,
                      shipping,
                      total
                    }}
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

      {/* Available Offers Modal */}
      {showOffersModal && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Available Offers</h3>
                <button
                  onClick={() => setShowOffersModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiTrash2 size={20} className="text-gray-500" />
                </button>
              </div>

              {offersLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
              ) : availableDiscounts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No offers available at the moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableDiscounts.map((discount) => (
                    <div key={discount._id || discount.couponCode} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-800">{discount.couponCode}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              discount.type === 'PERCENTAGE' ? 'bg-green-100 text-green-800' :
                              discount.type === 'FIXED_AMOUNT' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {discount.type === 'PERCENTAGE' ? `${discount.value}% off` :
                               discount.type === 'FIXED_AMOUNT' ? `₹${discount.value} off` :
                               'Free Delivery'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{discount.description}</p>
                          {discount.minCartValue > 0 && (
                            <p className="text-xs text-gray-500">
                              Minimum cart value: ₹{discount.minCartValue}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => applyDiscountFromModal(discount)}
                          disabled={appliedDiscount && appliedDiscount.couponCode === discount.couponCode}
                          className="ml-3 px-3 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {appliedDiscount && appliedDiscount.couponCode === discount.couponCode ? 'Applied' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Or enter a coupon code manually above
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;