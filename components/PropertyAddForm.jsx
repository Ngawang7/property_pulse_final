'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const PropertyAddForm = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    type: '',
    name: '',
    description: '',
    listingType: 'SALE',
    location: '',
    price: '',
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    images: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
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

    const formData = new FormData();

    Object.keys(fields).forEach(key => {
      if (key === 'images') {
        for (let i = 0; i < fields.images.length; i++) {
          formData.append('images', fields.images[i]);
        }
      } else if (key === 'location') {
        formData.append('location', JSON.stringify(fields.location));
      } else {
        formData.append(key, fields[key]);
      }
    });

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Something went wrong');
      }

      router.push('/properties');
      toast.success('Property created successfully!');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
      console.error('Error creating property:', error);
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
            <option value=''>Select Property Type</option>
            <option value='Apartment'>Apartment</option>
            <option value='House'>House</option>
            <option value='Land'>Land</option>
          </select>
        </div>

        <div className='mb-4'>
          <label htmlFor='listingType' className='block text-gray-700 font-bold mb-2'>
            Listing Type
          </label>
          <select
            id='listingType'
            name='listingType'
            className='border rounded w-full py-2 px-3'
            required
            value={fields.listingType}
            onChange={handleChange}
          >
            <option value='SALE'>For Sale</option>
            <option value='RENT'>For Rent</option>
          </select>
        </div>

        <div className='mb-4'>
          <label htmlFor='price' className='block text-gray-700 font-bold mb-2'>
            Price
          </label>
          <input
            type='number'
            id='price'
            name='price'
            className='border rounded w-full py-2 px-3'
            placeholder='Enter property price'
            required
            min='0'
            step='0.01'
            value={fields.price || ''}
            onChange={handleChange}
          />
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
            placeholder='eg. Beautiful Land Plot In Thimphu'
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
            placeholder='Add a description of your property'
            value={fields.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className='mb-4 bg-blue-50 p-4'>
          <label className='block text-gray-700 font-bold mb-2'>Location</label>
          <select
            id='location'
            name='location'
            className='border rounded w-full py-2 px-3'
            required
            value={fields.location}
            onChange={handleChange}
          >
            <option value=''>Select Location</option>
            <option value='Bumthang'>Bumthang</option>
            <option value='Chhukha'>Chhukha</option>
            <option value='Dagana'>Dagana</option>
            <option value='Gasa'>Gasa</option>
            <option value='Haa'>Haa</option>
            <option value='Lhuntse'>Lhuntse</option>
            <option value='Mongar'>Mongar</option>
            <option value='Paro'>Paro</option>
            <option value='Pemagatshel'>Pemagatshel</option>
            <option value='Punakha'>Punakha</option>
            <option value='Samdrup Jongkhar'>Samdrup Jongkhar</option>
            <option value='Samtse'>Samtse</option>
            <option value='Sarpang'>Sarpang</option>
            <option value='Thimphu'>Thimphu</option>
            <option value='Trashigang'>Trashigang</option>
            <option value='Trashiyangtse'>Trashiyangtse</option>
            <option value='Trongsa'>Trongsa</option>
            <option value='Tsirang'>Tsirang</option>
            <option value='Wangdue Phodrang'>Wangdue Phodrang</option>
            <option value='Zhemgang'>Zhemgang</option>
          </select>
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
            name='sellerName'
            className='border rounded w-full py-2 px-3'
            placeholder='Name'
            required
            value={fields.sellerName}
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
            name='sellerEmail'
            className='border rounded w-full py-2 px-3'
            placeholder='Email address'
            required
            value={fields.sellerEmail}
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
            name='sellerPhone'
            className='border rounded w-full py-2 px-3'
            placeholder='Phone'
            required
            value={fields.sellerPhone}
            onChange={handleChange}
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='images'
            className='block text-gray-700 font-bold mb-2'
          >
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
        </div>

        <div>
          <button
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Add Property'}
          </button>
        </div>
      </form>
    )
  );
};

export default PropertyAddForm;
