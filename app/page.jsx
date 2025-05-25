import Hero from '@/components/Hero';
import HomeProperties from '@/components/HomeProperties';
import FeaturedProperties from '@/components/FeaturedProperties';
import AboutUs from '@/components/AboutUs';
import SearchSection from '@/components/SearchSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <SearchSection />
      <FeaturedProperties />
      <HomeProperties />
      <AboutUs />
    </>
  );
};
export default HomePage;
