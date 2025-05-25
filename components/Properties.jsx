'use client';
import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import Spinner from '@/components/Spinner';
import Pagination from '@/components/Pagination';
import { toast } from 'react-toastify';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch properties');
      }

      return res;
    } catch (error) {
      if (retries > 0 && (error.message.includes('Failed to fetch') || error.message.includes('ERR_BLOCKED_BY_CLIENT'))) {
        console.log(`Retrying... ${retries} attempts left`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetchWithRetry(
          `/api/properties?page=${page}&pageSize=${pageSize}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await res.json();
        setProperties(data.properties);
        setTotalItems(data.total);
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(error.message);
        
        if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          toast.error('Please disable your ad blocker or security extensions to view properties.');
        } else {
          toast.error(error.message || 'Failed to fetch properties. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          <Spinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='px-4 py-6'>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role='alert'>
            <strong className='font-bold'>Error: </strong>
            <span className='block sm:inline'>{error}</span>
            {error.includes('ERR_BLOCKED_BY_CLIENT') && (
              <div className='mt-2'>
                <p className='text-sm'>This error is likely caused by an ad blocker or security extension.</p>
                <p className='text-sm'>Please try:</p>
                <ul className='list-disc list-inside text-sm mt-1'>
                  <li>Disabling your ad blocker for this site</li>
                  <li>Disabling security extensions</li>
                  <li>Using a different browser</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        {properties.length === 0 ? (
          <div className='text-center py-10'>
            <h2 className='text-2xl font-bold text-gray-700 mb-4'>No Properties Found</h2>
            <p className='text-gray-600'>Try adjusting your search criteria or check back later for new listings.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
        {totalItems > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default Properties;
