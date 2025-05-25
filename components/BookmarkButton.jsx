'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { FaBookmark } from 'react-icons/fa';

const BookmarkButton = ({ property }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const checkSavedStatus = async () => {
      try {
        const res = await fetch(`/api/bookmarks/check?propertyId=${property.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 200) {
          const data = await res.json();
          setIsSaved(data.isBookmarked);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkSavedStatus();
  }, [property.id, userId]);

  const handleClick = async () => {
    if (!userId) {
      toast.error('You need to sign in to save a property');
      return;
    }

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        toast.success(data.message === 'Bookmark added' ? 'Property saved successfully' : 'Property removed from saved properties');
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  if (loading) return <p className='text-center'>Loading...</p>;

  return isSaved ? (
    <button
      onClick={handleClick}
      className='bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center transition-colors duration-200'
    >
      <FaBookmark className='mr-2' /> Remove from Saved
    </button>
  ) : (
    <button
      onClick={handleClick}
      className='bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center transition-colors duration-200'
    >
      <FaBookmark className='mr-2' /> Save Property
    </button>
  );
};
export default BookmarkButton;
