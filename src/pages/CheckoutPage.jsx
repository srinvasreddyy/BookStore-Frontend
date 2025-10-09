import React, { useState } from 'react';
// --- Step 1: Import React Icons ---
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { FcSimCardChip } from "react-icons/fc";


const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');

  const orderDetails = {
    items: [
      { id: 1, name: 'Pride and Prejudice', quantity: 1, price: 299.00 },
      { id: 2, name: 'The Great Gatsby', quantity: 1, price: 249.00 },
    ],
    shipping: 50.00,
  };

  const subtotal = orderDetails.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalBill = subtotal + orderDetails.shipping;

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
              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" id="fullName" className="w-full  py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input type="text" id="address" placeholder="123 Bookworm Lane" className="w-full  py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" />
                </div>
                  <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input type="text" id="city" className="w-full  py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
                  <input type="text" id="state" className="w-full  py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal Code</label>
                  <input type="text" id="zip" className="w-full  py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" />
                </div>
                  <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" id="phone" className="w-full  py-2 border-neutral-300 border px-4 rounded-lg shadow-sm focus:ring-black focus:border-black" />
                </div>
              </form>
            </div>
            
            {/* --- Step 2: Refactor Payment Method with Radio Buttons and React Icons --- */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-6">Payment Method</h2>
              <div className="space-y-4">

               

                {/* UPI Option */}
                <div onClick={() => setPaymentMethod('upi')} className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-black ring-2 ring-black' : ' py-2 border-neutral-300 border px-4 hover:border-gray-400'}`}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="h-5 w-5 text-black focus:ring-black  py-2 border-neutral-300 border px-4"
                    />
                    <FcSimCardChip className="h-6 w-6 ml-4 mr-3 " />
                    <span className="font-medium text-gray-800">UPI/Card</span>
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
              
              <div className="space-y-4 mb-6">
                {orderDetails.items.map(item => (
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
                  <span>Shipping</span>
                  <span>₹{orderDetails.shipping.toFixed(2)}</span>
                </div>
              </div>

              <hr className="border-gray-200 my-4" />

              <div className="flex justify-between text-gray-900 text-lg font-bold">
                <span>Total</span>
                <span>₹{totalBill.toFixed(2)}</span>
              </div>
              
              <button className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg mt-8 hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                Confirm and Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;