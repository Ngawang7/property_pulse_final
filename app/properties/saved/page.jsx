'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PropertyCard from '@/components/PropertyCard';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';

const SavedPropertiesPage = () => {
  const { data: session } = useSession();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const res = await fetch('/api/bookmarks');

        if (res.status === 200) {
          const data = await res.json();
          setSavedProperties(data);
        } else {
          console.log(res.statusText);
          toast.error('Failed to fetch saved properties');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch saved properties');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        {/* Saved Properties Section */}
        <div>
          <h2 className='text-2xl font-bold mb-4'>Saved Properties</h2>
          {savedProperties.length === 0 ? (
            <p>No saved properties</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SavedPropertiesPage;
