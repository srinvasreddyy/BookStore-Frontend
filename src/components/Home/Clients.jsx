import React, { useState, useEffect } from 'react';
import { apiGet } from '../../lib/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await apiGet('/clients');
        setClients(response.data || []);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-900">Our Trusted Partners</h2>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll">
          {/* First set of logos */}
          {clients.map((client) => (
            <div
              key={client._id}
              className="flex-none mx-8 w-48"
            >
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={client.image}
                  alt={client.name}
                  className="h-20 w-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </a>
            </div>
          ))}
          {/* Duplicate set for seamless scrolling */}
          {clients.map((client) => (
            <div
              key={`${client._id}-duplicate`}
              className="flex-none mx-8 w-48"
            >
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={client.image}
                  alt={client.name}
                  className="h-20 w-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clients;