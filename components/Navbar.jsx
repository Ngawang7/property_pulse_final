'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaBars, FaTimes, FaUser, FaBookmark, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  const handleNavigation = (path) => {
    if (status === 'loading') {
      toast.info('Please wait while we load your session...');
      return;
    }

    // Check for protected routes
    if (path === '/properties/add' && (!session || session.user.role !== 'ADMIN')) {
      toast.error('You must be an admin to access this page');
      router.push('/auth/signin');
      return;
    }

    if (path === '/properties/saved' && !session) {
      toast.error('You must be signed in to view saved properties');
      router.push('/auth/signin');
      return;
    }

    router.push(path);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isHomePage 
          ? (isScrolled ? 'bg-blue-700/50 backdrop-blur-sm shadow-lg' : 'bg-transparent')
          : 'bg-blue-700/50 backdrop-blur-sm shadow-lg'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center'>
            <span className='text-xl font-bold text-white'>
              BhtEstate
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link 
              href="/" 
              className={`text-white hover:text-blue-200 transition-colors duration-200 ${
                pathname === '/' ? 'font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/properties/sale" 
              className={`text-white hover:text-blue-200 transition-colors duration-200 ${
                pathname === '/properties/sale' ? 'font-semibold' : ''
              }`}
            >
              For Sale
            </Link>
            <Link 
              href="/properties/rent" 
              className={`text-white hover:text-blue-200 transition-colors duration-200 ${
                pathname === '/properties/rent' ? 'font-semibold' : ''
              }`}
            >
              For Rent
            </Link>
            <Link 
              href="/mortgage-calculator" 
              className={`text-white hover:text-blue-200 transition-colors duration-200 ${
                pathname === '/mortgage-calculator' ? 'font-semibold' : ''
              }`}
            >
              Mortgage Calculator
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link 
                href="/properties/add" 
                className={`text-white hover:text-blue-200 transition-colors duration-200 ${
                  pathname === '/properties/add' ? 'font-semibold' : ''
                }`}
              >
                Add Property
              </Link>
            )}
          </div>

          {/* Right Side Menu */}
          <div className='hidden md:flex items-center space-x-4'>
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-white hover:text-blue-200 transition-colors duration-200"
                >
                  <span className="mr-2">{session.user.name}</span>
                  <FaChevronDown className={`transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href='/profile'
                      className='flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50'
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </Link>
                    <Link
                      href='/properties/saved'
                      className='flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50'
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <FaBookmark className="mr-2" />
                      Saved Properties
                    </Link>
                    <Link
                      href='/api/auth/signout'
                      className='flex items-center px-4 py-2 text-red-600 hover:bg-blue-50'
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign Out
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href='/auth/signin'
                  className='text-white hover:text-blue-200 transition-colors duration-200'
                >
                  Sign In
                </Link>
                <Link
                  href='/auth/register'
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='text-white hover:text-blue-200 focus:outline-none'
            >
              {isMobileMenuOpen ? (
                <FaTimes className='h-6 w-6' />
              ) : (
                <FaBars className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-blue-700/50 backdrop-blur-sm'>
          <div className='space-y-1 px-2 pb-3 pt-2'>
            <Link
              href='/'
              className={`block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-300/50 transition-colors duration-200 ${
                pathname === '/' ? 'bg-blue-300/50' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href='/properties/sale'
              className={`block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-300/50 transition-colors duration-200 ${
                pathname === '/properties/sale' ? 'bg-blue-300/50' : ''
              }`}
            >
              For Sale
            </Link>
            <Link
              href='/properties/rent'
              className={`block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-300/50 transition-colors duration-200 ${
                pathname === '/properties/rent' ? 'bg-blue-300/50' : ''
              }`}
            >
              For Rent
            </Link>
            <Link
              href='/mortgage-calculator'
              className={`block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-300/50 transition-colors duration-200 ${
                pathname === '/mortgage-calculator' ? 'bg-blue-300/50' : ''
              }`}
            >
              Mortgage Calculator
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link
                href='/properties/add'
                className={`block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-300/50 transition-colors duration-200 ${
                  pathname === '/properties/add' ? 'bg-blue-300/50' : ''
                }`}
              >
                Add Property
              </Link>
            )}
            {session ? (
              <>
                <Link
                  href='/profile'
                  className='block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-300/50 transition-colors duration-200'
                >
                  Profile
                </Link>
                <Link
                  href='/properties/saved'
                  className='block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-300/50 transition-colors duration-200'
                >
                  Saved Properties
                </Link>
                <Link
                  href='/api/auth/signout'
                  className='block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-300/50 transition-colors duration-200'
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href='/auth/signin'
                  className='block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-300/50 transition-colors duration-200'
                >
                  Sign In
                </Link>
                <Link
                  href='/auth/register'
                  className='block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-300/50 transition-colors duration-200'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
