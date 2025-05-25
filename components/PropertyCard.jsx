'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarker, FaTrash } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const defaultImage = '/images/property-default.jpg';

const PropertyCard = ({ property }) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent navigation to property details
    e.stopPropagation(); // Prevent event bubbling

    const confirmed = window.confirm(
      'Are you sure you want to delete this property?'
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'DELETE',
      });

      if (res.status === 200) {
        toast.success('Property deleted successfully');
        // Refresh the page to update the list
        window.location.reload();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete property');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete property');
    }
  };

  // Format price consistently
  const formattedPrice = new Intl.NumberFormat('en-US').format(property.price);

  // Get the image URL or use default
  const imageUrl = property.images?.[0] || defaultImage;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200 z-10"
          title="Delete Property"
        >
          <FaTrash />
        </button>
      )}
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-48 w-full overflow-hidden group">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[0].startsWith('/api/images/') ? property.images[0] : `/api/images/${property.images[0]}`}
              alt={property.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              priority={true}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
              No Image
        </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 hover:text-blue-600 transition-colors duration-200">{property.name}</h3>
          <p className="text-sm text-gray-600 mb-1">{property.type}</p>
          <p className="text-sm text-gray-500 mb-2 flex items-center">
            <FaMapMarker className="mr-1 text-blue-500" />
            {property.location}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-blue-600 font-bold text-lg">Nu. {formattedPrice}</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs transition-colors duration-200 hover:bg-blue-200">
              {property.listingType === 'RENT' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
