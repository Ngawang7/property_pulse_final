'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const PropertyAddForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  
  console.log('PropertyAddForm - Session:', session);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    type: 'Apartment',
    name: '',
    description: '',
    location: {
      street: '',
      city: '',
      state: '',
      zipcode: '',
    },
    beds: '',
    baths: '',
    square_feet: '',
    amenities: [],
    rates: {
      weekly: '',
      monthly: '',
      nightly: '',
    },
    seller_info: {
      name: '',
      email: '',
      phone: '',
    },
    images: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is nested
    if (name.includes('.')) {
      const [outerKey, innerKey] = name.split('.');
      setFields((prevFields) => ({
        ...prevFields,
        [outerKey]: {
          ...prevFields[outerKey],
          [innerKey]: value,
        },
      }));
    } else {
      setFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    const updatedAmenities = [...fields.amenities];

    if (checked) {
      updatedAmenities.push(value);
    } else {
      const index = updatedAmenities.indexOf(value);
      if (index !== -1) {
        updatedAmenities.splice(index, 1);
      }
    }

    setFields((prevFields) => ({
      ...prevFields,
      amenities: updatedAmenities,
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    const updatedImages = [...fields.images];

    for (const file of files) {
      updatedImages.push(file);
    }

    setFields((prevFields) => ({
      ...prevFields,
      images: updatedImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting property with session:', session);
      
      const formData = new FormData();
      formData.append('type', fields.type);
      formData.append('name', fields.name);
      formData.append('description', fields.description);
      formData.append('location', JSON.stringify(fields.location));
      formData.append('beds', fields.beds);
      formData.append('baths', fields.baths);
      formData.append('square_feet', fields.square_feet);
      formData.append('amenities', JSON.stringify(fields.amenities));
      formData.append('rates', JSON.stringify(fields.rates));
      formData.append('seller_info', JSON.stringify(fields.seller_info));

      fields.images.forEach((image) => {
        formData.append('images', image);
      });

      const res = await fetch('/api/properties', {
        method: 'POST',
        body: formData,
      });

      if (res.status === 201) {
        toast.success('Property Added Successfully');
        router.push('/properties');
      } else {
        const data = await res.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Something Went Wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    mounted && (
      <form onSubmit={handleSubmit} className='mb-4'>
        <h2 className='text-3xl text-center font-semibold mb-6'>
          Add Property
        </h2>

        <div className='mb-4'>
          <label htmlFor='type' className='block text-gray-700 font-bold mb-2'>
            Property Type
          </label>
          <select
            id='type'
            name='type'
            className='border rounded w-full py-2 px-3'
            required
            value={fields.type}
            onChange={handleChange}
          >
            <option value='Apartment'>Apartment</option>
            <option value='Condo'>Condo</option>
            <option value='House'>House</option>
            <option value='Cabin Or Cottage'>Cabin or Cottage</option>
            <option value='Room'>Room</option>
            <option value='Studio'>Studio</option>
            <option value='Other'>Other</option>
          </select>
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 font-bold mb-2'>
            Listing Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='eg. Beautiful Apartment In Miami'
            required
            value={fields.name}
            onChange={handleChange}
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='description'
            className='block text-gray-700 font-bold mb-2'
          >
            Description
          </label>
          <textarea
            id='description'
            name='description'
            className='border rounded w-full py-2 px-3'
            rows='4'
            placeholder='Add an optional description of your property'
            value={fields.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className='mb-4 bg-blue-50 p-4'>
          <label className='block text-gray-700 font-bold mb-2'>
            Location
          </label>
          <input
            type='text'
            id='street'
            name='location.street'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='Street'
            value={fields.location.street}
            onChange={handleChange}
          />
          <input
            type='text'
            id='city'
            name='location.city'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='City'
            required
            value={fields.location.city}
            onChange={handleChange}
          />
          <input
            type='text'
            id='state'
            name='location.state'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='State'
            required
            value={fields.location.state}
            onChange={handleChange}
          />
          <input
            type='text'
            id='zipcode'
            name='location.zipcode'
            className='border rounded w-full py-2 px-3 mb-2'
            placeholder='Zipcode'
            value={fields.location.zipcode}
            onChange={handleChange}
          />
        </div>

        <div className='mb-4 flex flex-wrap'>
          <div className='w-full md:w-1/3 pr-2'>
            <label
              htmlFor='beds'
              className='block text-gray-700 font-bold mb-2'
            >
              Beds
            </label>
            <input
              type='number'
              id='beds'
              name='beds'
              className='border rounded w-full py-2 px-3'
              required
              value={fields.beds}
              onChange={handleChange}
            />
          </div>
          <div className='w-full md:w-1/3 px-2'>
            <label
              htmlFor='baths'
              className='block text-gray-700 font-bold mb-2'
            >
              Baths
            </label>
            <input
              type='number'
              id='baths'
              name='baths'
              className='border rounded w-full py-2 px-3'
              required
              value={fields.baths}
              onChange={handleChange}
            />
          </div>
          <div className='w-full md:w-1/3 pl-2'>
            <label
              htmlFor='square_feet'
              className='block text-gray-700 font-bold mb-2'
            >
              Square Feet
            </label>
            <input
              type='number'
              id='square_feet'
              name='square_feet'
              className='border rounded w-full py-2 px-3'
              required
              value={fields.square_feet}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 font-bold mb-2'>
            Amenities
          </label>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2'>
            <div>
              <input
                type='checkbox'
                id='amenity_wifi'
                name='amenities'
                value='Wifi'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_wifi'>Wifi</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_kitchen'
                name='amenities'
                value='Full Kitchen'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_kitchen'>Full Kitchen</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_washer_dryer'
                name='amenities'
                value='Washer & Dryer'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_washer_dryer'>Washer & Dryer</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_free_parking'
                name='amenities'
                value='Free Parking'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_free_parking'>Free Parking</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_pool'
                name='amenities'
                value='Swimming Pool'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_pool'>Swimming Pool</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_hot_tub'
                name='amenities'
                value='Hot Tub'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_hot_tub'>Hot Tub</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_24_7'
                name='amenities'
                value='24/7 Security'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_24_7'>24/7 Security</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_wheelchair'
                name='amenities'
                value='Wheelchair Accessible'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_wheelchair'>Wheelchair Accessible</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_elevator_access'
                name='amenities'
                value='Elevator Access'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_elevator_access'>Elevator Access</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_dishwasher'
                name='amenities'
                value='Dishwasher'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_dishwasher'>Dishwasher</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_gym_fitness'
                name='amenities'
                value='Gym/Fitness Center'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_gym_fitness'>Gym/Fitness Center</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_air_conditioning'
                name='amenities'
                value='Air Conditioning'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_air_conditioning'>Air Conditioning</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_workspace'
                name='amenities'
                value='Dedicated Workspace'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_workspace'>Dedicated Workspace</label>
            </div>
            <div>
              <input
                type='checkbox'
                id='amenity_pets_allowed'
                name='amenities'
                value='Pets Allowed'
                onChange={handleAmenitiesChange}
                className='mr-2'
              />
              <label htmlFor='amenity_pets_allowed'>Pets Allowed</label>
            </div>
          </div>
        </div>

        <div className='mb-4 bg-blue-50 p-4'>
          <label className='block text-gray-700 font-bold mb-2'>
            Rates (Leave blank if not applicable)
          </label>
          <div className='flex flex-wrap space-y-4 md:space-y-0'>
            <div className='w-full md:w-1/3 md:pr-2'>
              <label
                htmlFor='weekly_rate'
                className='block text-gray-700 font-bold mb-2'
              >
                Weekly Rate
              </label>
              <input
                type='number'
                id='weekly_rate'
                name='rates.weekly'
                className='border rounded w-full py-2 px-3'
                placeholder='0'
                value={fields.rates.weekly}
                onChange={handleChange}
              />
            </div>
            <div className='w-full md:w-1/3 md:px-2'>
              <label
                htmlFor='monthly_rate'
                className='block text-gray-700 font-bold mb-2'
              >
                Monthly Rate
              </label>
              <input
                type='number'
                id='monthly_rate'
                name='rates.monthly'
                className='border rounded w-full py-2 px-3'
                placeholder='0'
                value={fields.rates.monthly}
                onChange={handleChange}
              />
            </div>
            <div className='w-full md:w-1/3 md:pl-2'>
              <label
                htmlFor='nightly_rate'
                className='block text-gray-700 font-bold mb-2'
              >
                Nightly Rate
              </label>
              <input
                type='number'
                id='nightly_rate'
                name='rates.nightly'
                className='border rounded w-full py-2 px-3'
                placeholder='0'
                value={fields.rates.nightly}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='seller_name'
            className='block text-gray-700 font-bold mb-2'
          >
            Seller Name
          </label>
          <input
            type='text'
            id='seller_name'
            name='seller_info.name'
            className='border rounded w-full py-2 px-3'
            placeholder='Name'
            required
            value={fields.seller_info.name}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='seller_email'
            className='block text-gray-700 font-bold mb-2'
          >
            Seller Email
          </label>
          <input
            type='email'
            id='seller_email'
            name='seller_info.email'
            className='border rounded w-full py-2 px-3'
            placeholder='Email address'
            required
            value={fields.seller_info.email}
            onChange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <label
            htmlFor='seller_phone'
            className='block text-gray-700 font-bold mb-2'
          >
            Seller Phone
          </label>
          <input
            type='tel'
            id='seller_phone'
            name='seller_info.phone'
            className='border rounded w-full py-2 px-3'
            placeholder='Phone number'
            value={fields.seller_info.phone}
            onChange={handleChange}
          />
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 font-bold mb-2'>
            Images (Select up to 4 images)
          </label>
          <input
            type='file'
            id='images'
            name='images'
            className='border rounded w-full py-2 px-3'
            accept='image/*'
            multiple
            onChange={handleImageChange}
            required
          />
          <p className='text-sm text-gray-600 mt-1'>
            First image will be the cover (max 4)
          </p>
        </div>

        <div>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Adding Property...' : 'Add Property'}
          </button>
        </div>
      </form>
    )
  );
};

export default PropertyAddForm;
