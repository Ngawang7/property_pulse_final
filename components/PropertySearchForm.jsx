'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const PropertySearchForm = () => {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchLocations = async () => {
      if (!isMounted) return;
      
      try {
        const res = await fetch('/api/properties/locations');
        if (res.ok) {
          const data = await res.json();
          // Remove quotes from location values
          const cleanLocations = data.map(loc => loc.replace(/"/g, ''));
          if (isMounted) {
            setLocations(cleanLocations);
          }
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine listing type from the current page
    const listingType = pathname.includes('/rent') ? 'rent' : 'sale';

    if (location === '' && propertyType === 'All') {
      router.push(pathname);
    } else {
      const query = `?location=${encodeURIComponent(location)}&propertyType=${propertyType}&listingType=${listingType}`;
      router.push(`/properties/search-results${query}`);
    }
  };

  // Loading state
  if (!mounted || loading) {
    return (
      <div className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center">
        <div className="w-full h-12 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center">
        <div className="w-full h-12 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    }>
      <form
        onSubmit={handleSubmit}
        className='mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center'
      >
        <div className='w-full md:w-3/5 md:pr-2 mb-4 md:mb-0'>
          <label htmlFor='location' className='sr-only'>
            Location
          </label>
          <select
            id='location'
            className='w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring focus:ring-blue-500 border-2 border-blue-200 hover:border-blue-300 transition-colors duration-200'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          >
            <option value=''>Select Location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full md:w-2/5 md:pl-2'>
          <label htmlFor='property-type' className='sr-only'>
            Property Type
          </label>
          <select
            id='property-type'
            className='w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring focus:ring-blue-500 border-2 border-blue-200 hover:border-blue-300 transition-colors duration-200'
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value='All'>All</option>
            <option value='Apartment'>Apartment</option>
            <option value='House'>House</option>
            <option value='Land'>Land</option>
          </select>
        </div>
        <button
          type='submit'
          className='md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 border-2 border-blue-400 transition-all duration-200'
        >
          Search
        </button>
      </form>
    </Suspense>
  );
};

export default PropertySearchForm;
