import Link from 'next/link';
import Image from 'next/image';
import PropertySearchForm from './PropertySearchForm';

const Hero = () => {
  return (
    <section className='relative h-[600px] flex items-center'>
      {/* Background Image with Overlay */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/images/hero-bg.jpg'
          alt='Hero Background'
          fill
          priority
          className='object-cover'
        />
        <div className='absolute inset-0 bg-black/50'></div>
      </div>

      {/* Content */}
      <div className='container-xl lg:container m-auto px-4 relative z-10'>
        <div className='max-w-3xl mx-auto text-center text-white'>
          <h1 className='text-4xl md:text-5xl font-bold mb-6'>
            Find Your Dream Property
          </h1>
          <p className='text-xl mb-8'>
            Discover the perfect property that matches your lifestyle and preferences
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/properties/sale'
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg transition duration-300'
            >
              Properties For Sale
            </Link>
            <Link
              href='/properties/rent'
              className='bg-white hover:bg-gray-100 text-blue-600 px-6 py-3 rounded-lg font-bold text-lg transition duration-300'
            >
              Properties For Rent
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent'></div>
    </section>
  );
};

export default Hero;
