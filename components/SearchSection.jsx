import PropertySearchForm from './PropertySearchForm';

const SearchSection = () => {
  return (
    <section className='relative -mt-16 mb-12'>
      <div className='container-xl lg:container m-auto px-4'>
        <div className='bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 md:p-8 border border-white/20'>
          <PropertySearchForm />
        </div>
      </div>
    </section>
  );
};

export default SearchSection; 