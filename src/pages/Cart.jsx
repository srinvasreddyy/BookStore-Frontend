import React, { useState } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

const Cart = () => {
  // Sample cart data - replace with your actual cart state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 299,
      quantity: 1,
      image: "https://plus.unsplash.com/premium_photo-1669652639337-c513cc42ead6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 349,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 249,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80",
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 49;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cart Items (Left Side) */}
          <div className="lg:col-span-8 space-y-3">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center">
                <p className="text-gray-500">Your cart is empty</p>
                <button className="mt-3 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm">
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-sm">
                  {/* Book Image */}
                  <div className="w-16 h-24 sm:w-20 sm:h-28 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Book Details */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{item.author}</p>
                    <p className="text-base sm:text-lg font-bold mt-1 sm:mt-2">₹{item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-6 sm:w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Order Summary (Right Side) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including GST</p>
                </div>
              </div>

              <button className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Proceed to Checkout
              </button>

              <div className="mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Estimated delivery:</span>
                  <span className="font-medium">3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;