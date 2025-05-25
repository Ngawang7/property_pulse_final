'use client';

import { useState } from 'react';
import Image from 'next/image';

const PropertyImageModal = ({ image, property }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='absolute inset-0 group cursor-pointer' onClick={() => setIsOpen(true)}>
        <Image
          src={image}
          alt={property.name || 'Property Image'}
          fill={true}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          style={{ objectFit: 'cover' }}
          className='rounded-t-xl transition-all duration-300 group-hover:opacity-80'
          priority={true}
        />
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40'>
          <span className='text-white text-sm font-medium px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors'>
            Click to View
          </span>
        </div>
      </div>

      {isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4' onClick={() => setIsOpen(false)}>
          <div className='relative max-w-4xl w-full bg-white rounded-lg overflow-hidden' onClick={e => e.stopPropagation()}>
            <div className='relative w-full' style={{ paddingTop: '60%' }}>
              <Image
                src={image}
                alt={property.name || 'Property Image'}
                fill={true}
                style={{ objectFit: 'contain' }}
                className='p-2'
                priority={true}
              />
            </div>
            <div className='p-4 bg-white'>
              <h3 className='text-xl font-bold mb-2'>{property.name}</h3>
              <p className='text-gray-600 mb-2'>{property.type} in {property.city}, {property.state}</p>
              <div className='flex gap-4 text-sm text-gray-500'>
                <p>{property.beds} beds</p>
                <p>{property.baths} baths</p>
                <p>{property.square_feet} sqft</p>
              </div>
            </div>
            <button
              className='absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-800 hover:bg-gray-100'
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyImageModal; 