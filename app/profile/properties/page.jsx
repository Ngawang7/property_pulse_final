'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import PropertyCard from '@/components/PropertyCard';
import Spinner from '@/components/Spinner';
import { useRouter } from 'next/navigation';

const UserPropertiesPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchUserProperties = async () => {
      try {
        const res = await fetch('/api/profile/properties');
        
        if (!res.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Error fetching your properties');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchUserProperties();
    }
  }, [status, router]);

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner loading={loading} />
      </div>
    );
  }

  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Your Properties</h1>
        {properties.length === 0 ? (
          <div className="text-center">
            <p className="text-2xl mb-4">No properties found</p>
            <button
              onClick={() => router.push('/properties/add')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Add Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UserPropertiesPage; 