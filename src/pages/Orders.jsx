import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from '@tanstack/react-router';

const Orders = () => {
  const { user } = useAuth();

  // Mock orders data - replace with actual API call
  const orders = [
    // Add mock orders here or fetch from API
  ];

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
            {orders.length === 0 ? (
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