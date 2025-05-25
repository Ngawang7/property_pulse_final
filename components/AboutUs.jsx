import { FaHome, FaUsers, FaHandshake, FaChartLine } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <section className='relative py-20 overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50'></div>
      <div className='absolute inset-0 bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6),linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-5'></div>

      <div className='container-xl lg:container m-auto px-4 relative'>
        {/* Main Title with Decorative Elements */}
        <div className='text-center mb-16 relative'>
          <div className='absolute left-1/2 -translate-x-1/2 -top-8 w-24 h-1 bg-blue-500 rounded-full'></div>
          <h2 className='text-4xl font-bold text-blue-600 mb-6'>About BhtEstate</h2>
          <p className='text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed'>
            Your trusted partner in real estate, connecting buyers, sellers, and renters with their perfect properties.
          </p>
        </div>

        {/* Feature Cards with Hover Effects */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          <div className='group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'>
            <div className='text-blue-500 text-5xl mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300'>
              <FaHome />
            </div>
            <h3 className='text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300'>Property Excellence</h3>
            <p className='text-gray-600 leading-relaxed'>
              We curate the finest properties, ensuring quality and value for our clients.
            </p>
          </div>

          <div className='group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'>
            <div className='text-blue-500 text-5xl mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300'>
              <FaUsers />
            </div>
            <h3 className='text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300'>Expert Team</h3>
            <p className='text-gray-600 leading-relaxed'>
              Our experienced professionals are dedicated to providing exceptional service.
            </p>
          </div>

          <div className='group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'>
            <div className='text-blue-500 text-5xl mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300'>
              <FaHandshake />
            </div>
            <h3 className='text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300'>Trusted Service</h3>
            <p className='text-gray-600 leading-relaxed'>
              Building lasting relationships through transparency and reliability.
            </p>
          </div>

          <div className='group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2'>
            <div className='text-blue-500 text-5xl mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300'>
              <FaChartLine />
            </div>
            <h3 className='text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300'>Market Insight</h3>
            <p className='text-gray-600 leading-relaxed'>
              Providing valuable market insights to help you make informed decisions.
            </p>
          </div>
        </div>

        {/* Bottom Content with Gradient Border */}
        <div className='mt-20 relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl opacity-10'></div>
          <div className='relative bg-white p-8 rounded-2xl shadow-lg'>
            <p className='text-gray-600 text-lg leading-relaxed text-center max-w-4xl mx-auto'>
              At BhtEstate, we believe in making real estate transactions seamless and enjoyable. 
              Our platform combines cutting-edge technology with personalized service to deliver 
              exceptional results for all our clients. Whether you're buying, selling, or renting, 
              we're here to guide you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs; 