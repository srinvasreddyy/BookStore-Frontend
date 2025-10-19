import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from '@tanstack/react-router';
import { getUserOrders } from '../lib/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getUserOrders()
      .then((res) => {
        if (!mounted) return;
        // API returns ApiResponse { statusCode, data: { orders, pagination }, message }
        const data = res?.data?.orders || [];
        setOrders(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load orders');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white py-4 max-lg:py-2 px-0 sm:px-6 lg:px-8">
      <div className="w-full px-20 max-lg:px-0 mx-auto">
        <div className="bg-white">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl max-lg:text-xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-1 max-lg:text-xs text-sm text-gray-600">
              Welcome back, {user?.fullName}! Here are your recent orders.
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">Loading your orders...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders yet. Start shopping to see your orders here!
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Order #{order.id}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">
                          ${order.total}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                    {order.books && order.books.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {order.books.map((b, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                            {b.images && b.images[0] ? (
                              <img src={b.images[0]} alt={b.title} className="w-14 h-20 object-cover rounded-md" />
                            ) : (
                              <div className="w-14 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-300">No Image</div>
                            )}
                            <div>
                              <div className="font-medium">{b.title}</div>
                              <div className="text-xs text-gray-600">Qty: {b.quantity} — ${b.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Shipping & delivery details */}
                    <div className="mt-3 text-sm text-gray-700 border-t pt-3">
                      <div className="font-medium">Shipping address</div>
                      {order.shippingAddress ? (
                        <div className="text-xs text-gray-600 mt-1">
                          <div>{order.shippingAddress.fullName}</div>
                          <div>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</div>
                          <div>Phone: {order.shippingAddress.phone}</div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">No shipping address</div>
                      )}

                      <div className="mt-2">
                        <div className="font-medium">Delivery partner</div>
                        {order.deliveryBoyName ? (
                          <div className="text-xs text-gray-600 mt-1">{order.deliveryBoyName} — {order.deliveryBoyMobile}</div>
                        ) : (
                          <div className="text-xs text-gray-500">Not assigned yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;