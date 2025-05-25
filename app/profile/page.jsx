'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const profileEmail = session?.user?.email;
  const profileUsername = session?.user?.username;

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>Your Profile</h1>
          <div className='flex flex-col items-center'>
            <div className='text-center'>
              <h2 className='text-2xl mb-4'>
                <span className='font-bold block'>Username: </span> {profileUsername}
              </h2>
              <h2 className='text-2xl'>
                <span className='font-bold block'>Email: </span> {profileEmail}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
