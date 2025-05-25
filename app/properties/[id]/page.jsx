'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProperty } from '@/utils/requests';
import PropertyHeaderImage from '@/components/PropertyHeaderImage';
import PropertyDetails from '@/components/PropertyDetails';
import PropertyImages from '@/components/PropertyImages';
import BookmarkButton from '@/components/BookmarkButton';
import Spinner from '@/components/Spinner';
import { FaArrowLeft } from 'react-icons/fa';

const PropertyPage = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;
      try {
        const property = await fetchProperty(id);
        setProperty(property);
        setError(null);
      } catch (error) {
        console.error('Error fetching property:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (property === null) {
      fetchPropertyData();
    }
  }, [id, property]);

  if (loading) {
    return <Spinner loading={loading} />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error}</p>
        <Link
          href="/properties"
          className="text-blue-500 hover:text-blue-600 flex items-center justify-center mt-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Properties
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">Property Not Found</h1>
        <p className="text-gray-500">The property you're looking for doesn't exist or has been removed.</p>
        <Link
          href="/properties"
          className="text-blue-500 hover:text-blue-600 flex items-center justify-center mt-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Properties
        </Link>
      </div>
    );
  }

  return (
        <>
          <PropertyHeaderImage image={property.images[0]} />
          <section>
            <div className='container m-auto py-6 px-6'>
              <Link
                href='/properties'
                className='text-blue-500 hover:text-blue-600 flex items-center'
              >
                <FaArrowLeft className='mr-2' /> Back to Properties
              </Link>
            </div>
          </section>

          <section className='bg-blue-50'>
            <div className='container m-auto py-10 px-6'>
              <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
                <PropertyDetails property={property} />
                <aside className='space-y-4'>
                  <BookmarkButton property={property} />
                </aside>
              </div>
            </div>
          </section>
          <PropertyImages images={property.images} />
    </>
  );
};
export default PropertyPage;
