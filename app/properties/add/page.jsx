'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PropertyAddForm from '@/components/PropertyAddForm';
import Spinner from '@/components/Spinner';

const PropertyAddPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);

    if (status === 'unauthenticated') {
      console.log('User is not authenticated, redirecting to sign in');
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      console.log('User is not admin, redirecting to home');
      router.push('/');
      return;
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner loading={true} />
      </div>
    );
  }

  if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
    return (
      <section className='bg-blue-50'>
        <div className='container m-auto max-w-2xl py-24'>
          <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
            <PropertyAddForm />
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default PropertyAddPage;
