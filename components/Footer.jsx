'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/images/logo.png';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className='bg-blue-100'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-lg font-semibold text-blue-800 mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/' className='text-blue-600 hover:text-blue-800'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/properties' className='text-blue-600 hover:text-blue-800'>
                  Properties
                </Link>
              </li>
              <li>
                <Link href='/properties/sale' className='text-blue-600 hover:text-blue-800'>
                  For Sale
                </Link>
              </li>
              <li>
                <Link href='/properties/rent' className='text-blue-600 hover:text-blue-800'>
                  For Rent
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-blue-800 mb-4'>Contact Us</h3>
            <ul className='space-y-2'>
              <li className='text-blue-600'>Rinchending, phuentsholing</li>
              <li className='text-blue-600'>Phone: (+975) 17963852</li>
              <li className='text-blue-600'>Email: 02210209.cst@rub.edu.bt</li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-blue-800 mb-4'>Follow Us</h3>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-blue-600 hover:text-blue-800'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaFacebook className='text-2xl' />
              </a>
              <a
                href='#'
                className='text-blue-600 hover:text-blue-800'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaTwitter className='text-2xl' />
              </a>
              <a
                href='#'
                className='text-blue-600 hover:text-blue-800'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaInstagram className='text-2xl' />
              </a>
              <a
                href='#'
                className='text-blue-600 hover:text-blue-800'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaLinkedin className='text-2xl' />
              </a>
            </div>
          </div>
        </div>
        <div className='mt-8 pt-8 border-t border-blue-200'>
          <p className='text-center text-blue-600'>
            &copy; {currentYear} BhtEstate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
