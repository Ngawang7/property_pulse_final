import {
  FaMapMarker,
  FaCheck,
  FaUser,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';

const PropertyDetails = ({ property }) => {
  return (
    <main>
      <div className='bg-white p-6 rounded-lg shadow-md text-center md:text-left'>
        <div className='text-gray-500 mb-4'>{property.type}</div>
        <h1 className='text-3xl font-bold mb-4'>{property.name}</h1>
        <div className='text-gray-500 mb-4 flex align-middle justify-center md:justify-start'>
          <FaMapMarker className='text-lg text-orange-700 mr-2' />
          <p className='text-orange-700'>
            {property.location}
          </p>
        </div>

        <h3 className='text-lg font-bold my-6 bg-gray-800 text-white p-2'>
          Price
        </h3>
        <div className='grid grid-cols-1 gap-4'>
          {property.price > 0 && (
            <div className='border rounded-lg p-4'>
              <div className='text-gray-500'>{property.listingType === 'RENT' ? 'Monthly Rent' : 'Sale Price'}</div>
              <div className='text-2xl font-bold text-blue-500'>
                Nu. {property.price.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <h3 className='text-lg font-bold mb-6'>Description</h3>
        <p className='text-gray-500 mb-4 text-center'>{property.description}</p>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
        <h3 className='text-lg font-bold mb-6'>Seller Information</h3>
        <div className='space-y-4'>
          <div className='flex items-center'>
            <FaUser className='text-blue-500 mr-2' />
            <span className='text-gray-700'>{property.sellerName}</span>
          </div>
          <div className='flex items-center'>
            <FaEnvelope className='text-blue-500 mr-2' />
            <span className='text-gray-700'>{property.sellerEmail}</span>
          </div>
          <div className='flex items-center'>
            <FaPhone className='text-blue-500 mr-2' />
            <span className='text-gray-700'>{property.sellerPhone}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetails;