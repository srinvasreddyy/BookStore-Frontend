import React, { useState, useEffect } from 'react';
// --- Step 1: Import React Icons ---
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { FcSimCardChip } from "react-icons/fc";
import { getCart, initiateOrder, getRazorpayKey, reportPaymentFailure } from '../lib/api';
import toast from 'react-hot-toast';
import { Link, useNavigate, useLocation } from '@tanstack/react-router';


const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [razorpayKey, setRazorpayKey] = useState('');
  const [razorpayAvailable, setRazorpayAvailable] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Discount information from cart
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Fetch cart data and Razorpay key on component mount
  useEffect(() => {
    fetchCartData();
    fetchRazorpayKey();
    
    // Extract discount information from navigation state
    if (location.state) {
      setAppliedDiscount(location.state.appliedDiscount || null);
      setDiscountAmount(location.state.discountAmount || 0);
    }
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      const cart = response.data;
      
      // Transform cart items for display
      const transformedItems = cart.items.map(item => ({
        id: item.book._id,
        name: item.book.title,
        quantity: item.quantity,
        price: item.book.price,
        deliveryCharge: item.book.deliveryCharge || 0,
        image: item.book.coverImages?.[0] || ''
      }));
      
      setCartItems(transformedItems);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRazorpayKey = async () => {
    try {
      const response = await getRazorpayKey();
      setRazorpayKey(response.key);
      setRazorpayAvailable(true);
    } catch (error) {
      console.error('Failed to fetch Razorpay key:', error);
      setRazorpayAvailable(false);
      // If UPI was selected but now unavailable, switch to COD
      if (paymentMethod === 'upi') {
        setPaymentMethod('cod');
      }
      // Don't show error toast for key fetch failure, just log it
    }
  };

  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['fullName', 'address', 'city', 'state', 'zip', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field].trim());
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setSubmitting(true);

      if (paymentMethod === 'cod') {
        // Create order with Cash on Delivery
        const orderData = {
          paymentMethod: 'CASH_ON_DELIVERY',
          shippingAddress,
          couponCode: appliedDiscount?.couponCode || null, // Include coupon code for server validation
        };

        const response = await initiateOrder(orderData);
        if (response && response.success) {
          toast.success('Order placed successfully!');
          navigate({ to: '/orders' });
        } else {
          throw new Error('Failed to place order');
        }
      } else {
        // UPI/Card payment - initiate Razorpay payment
        if (!razorpayAvailable) {
          toast.error('Payment system is not available right now');
          return;
        }

        // Log frontend calculations for debugging
        console.log('Frontend Calculations:', {
          subtotal: subtotal.toFixed(2),
          totalDeliveryCharges: totalDeliveryCharges.toFixed(2),
          discountAmount: discountAmount.toFixed(2),
          totalBill: totalBill.toFixed(2),
          totalBillInPaise: Math.round(totalBill * 100)
        });

        const orderData = {
          paymentMethod: 'RAZORPAY',
          shippingAddress,
          appliedDiscount,
          discountAmount,
          couponCode: appliedDiscount?.couponCode || null, // Include coupon code for server validation
        };

        const response = await initiateOrder(orderData);
        const { order, razorpayOrder } = response.data;

        console.log('Server Response:', {
          orderSubtotal: order.subtotal,
          orderDeliveryCharges: order.deliveryCharges || order.totalDeliveryCharges,
          orderDiscountAmount: order.discountAmount,
          orderFinalAmount: order.finalAmount,
          razorpayAmount: razorpayOrder.amount,
          razorpayAmountInRupees: (razorpayOrder.amount / 100).toFixed(2)
        });

        // Check if Razorpay is loaded
        if (typeof window.Razorpay === 'undefined') {
          toast.error('Razorpay payment system is not loaded. Please refresh the page.');
          return;
        }

        // Initialize Razorpay payment with correct amount
        const options = {
          key: razorpayKey,
          amount: razorpayOrder.amount, // Amount in paise (already calculated on server)
          currency: razorpayOrder.currency,
          name: 'Indian Books House',
          description: 'Book Purchase',
          order_id: razorpayOrder.id,
          handler: async function (response) {
            console.log('Payment successful:', response);
            
            // Show loading toast
            const loadingToast = toast.loading('Processing your order...');
            
            try {
              // Wait a bit for webhook to process (optional but recommended)
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              toast.dismiss(loadingToast);
              toast.success('Payment successful! Your order has been placed.');
              
              // Redirect to orders page to see the order
              navigate({ to: '/orders' });
            } catch (error) {
              toast.dismiss(loadingToast);
              console.error('Error after payment:', error);
              toast.success('Payment successful! Redirecting...');
              navigate({ to: '/' });
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            email: '', // You might want to get this from user data
            contact: shippingAddress.phone
          },
          theme: {
            color: '#000000'
          },
          modal: {
            ondismiss: async function() {
              console.log('Payment cancelled by user');
              
              // Report the cancellation to server
              try {
                await reportPaymentFailure(razorpayOrder.id, 'User cancelled payment');
              } catch (error) {
                console.error('Failed to report payment cancellation:', error);
              }
              
              toast.error('Payment was cancelled. Your order has not been placed.');
              setSubmitting(false);
            }
          }
        };

        console.log('Razorpay options:', options);

        try {
          const rzp = new window.Razorpay(options);
          
          rzp.on('payment.failed', async function (response) {
            console.error('Payment failed:', response);
            
            // Report the failure to server
            try {
              await reportPaymentFailure(razorpayOrder.id, response.error?.description || 'Payment failed');
            } catch (error) {
              console.error('Failed to report payment failure:', error);
            }
            
            toast.error('Payment failed. Please try again.');
            setSubmitting(false);
          });
          
          rzp.open();
        } catch (error) {
          console.error('Error opening Razorpay:', error);
          toast.error('Failed to open payment gateway. Please try again.');
          setSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Calculate total delivery charges from each product
  const totalDeliveryCharges = cartItems.reduce((sum, item) => sum + (item.deliveryCharge * item.quantity), 0);
  const shipping = totalDeliveryCharges;
  const totalBill = subtotal + shipping - discountAmount;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container max-w-7xl mx-auto  px-0 py-8 md:py-12">
        <div className="text-center mb-10 max-lg:mb-5">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="text-gray-600 max-lg:text-xs mt-2">Please enter your details to complete the purchase.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Side: Shipping and Payment */}
          <div className="w-full lg:w-2/3 bg-white p-6 sm:p-8 rounded-lg ">
            {/* Shipping Information Form */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-6">Shipping Address</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    value={shippingAddress.fullName}
                    onChange={(e) => handleAddressChange('fullName', e.target.value)}
                    className="w-full py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" 
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <input 
                    type="text" 
                    id="address" 
                    placeholder="123 Bookworm Lane"
                    value={shippingAddress.address}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    className="w-full py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input 
                    type="text" 
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State / Province *</label>
                  <input 
                    type="text" 
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal Code *</label>
                  <input 
                    type="text" 
                    id="zip"
                    value={shippingAddress.zip}
                    onChange={(e) => handleAddressChange('zip', e.target.value)}
                    className="w-full py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    className="w-full py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" 
                    required
                  />
                </div>
              </form>
            </div>
            
            {/* --- Step 2: Refactor Payment Method with Radio Buttons and React Icons --- */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-6">Payment Method</h2>
              <div className="space-y-4">

                {/* UPI/Card Option */}
                <div onClick={() => razorpayAvailable && setPaymentMethod('upi')} className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-black ring-2 ring-black' : ' py-2 border-neutral-300 border px-4 hover:border-gray-400'} ${!razorpayAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => razorpayAvailable && setPaymentMethod('upi')}
                      disabled={!razorpayAvailable}
                      className="h-5 w-5 text-black focus:ring-black  py-2 border-neutral-300 border px-4"
                    />
                    <FcSimCardChip className="h-6 w-6 ml-4 mr-3 " />
                    <span className={`font-medium ${!razorpayAvailable ? 'text-gray-400' : 'text-gray-800'}`}>UPI/Card {!razorpayAvailable && '(Unavailable)'}</span>
                  </div>
                </div>

                {/* Cash on Delivery Option */}
                <div onClick={() => setPaymentMethod('cod')} className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black ring-2 ring-black' : ' py-2 border-neutral-300 border px-4 hover:border-gray-400'}`}>
                  <div className="flex items-center">
                     <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-5 w-5 text-black focus:ring-black  py-2 border-neutral-300 border px-4"
                    />
                    <FaMoneyBillWave className="h-6 w-6 ml-4 mr-3 text-gray-600" />
                    <span className="font-medium text-gray-800">Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border max-lg:border-0 border-neutral-300 rounded-lg  p-6 sticky top-35">
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-6">Order Summary</h2>
              
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty</p>
                  <Link to="/" className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-gray-600">
                        <span>{item.name} (x{item.quantity})</span>
                        <span className="font-medium">₹{item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <hr className="border-gray-200 my-4" />

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Charges</span>
                      <span>₹{totalDeliveryCharges.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedDiscount.couponCode})</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-200 my-4" />

                  <div className="flex justify-between text-gray-900 text-lg font-bold">
                    <span>Total</span>
                    <span>₹{totalBill.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={handleSubmit}
                    disabled={submitting || cartItems.length === 0}
                    className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg mt-8 hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;