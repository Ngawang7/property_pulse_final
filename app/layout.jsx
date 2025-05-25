import { Inter } from 'next/font/google';
import '@/assets/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';
import 'react-toastify/dist/ReactToastify.css';
import 'photoswipe/dist/photoswipe.css';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BhtEstate | Find The Perfect Property',
  description: 'Find your dream property',
  keywords: 'rental, find rentals, find properties',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} bg-blue-100`}>
        <AuthProvider>
          <div className='flex flex-col min-h-screen'>
            <Navbar />
            <ClientLayout>{children}</ClientLayout>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
