import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PropertyImages = ({ images }) => {
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleImageError = (index, e) => {
    console.error(`Error loading image ${index}:`, e);
    setImageErrors(prev => ({ ...prev, [index]: true }));
    e.target.src = '/images/placeholder.jpg';
    toast.error('Failed to load image. Showing placeholder instead.');
  };

  if (!mounted) return null;

  if (!images || images.length === 0) {
    return (
      <section className='bg-blue-50 p-4'>
        <div className='container mx-auto'>
          <div className="relative h-[400px] w-full">
            <Image
              src="/images/placeholder.jpg"
              alt="No images available"
              fill
              className='object-cover rounded-xl'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              priority={true}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <Gallery>
      <section className='bg-blue-50 p-4'>
        <div className='container mx-auto'>
          {images.length === 1 ? (
            <Item
              original={imageErrors[0] ? '/images/placeholder.jpg' : images[0]}
              thumbnail={imageErrors[0] ? '/images/placeholder.jpg' : images[0]}
              width='1000'
              height='600'
            >
              {({ ref, open }) => (
                <div className="relative h-[400px] w-full">
                  <Image
                    ref={ref}
                    onClick={open}
                    src={imageErrors[0] ? '/images/placeholder.jpg' : images[0]}
                    alt='Property image'
                    fill
                    className='object-cover rounded-xl'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    priority={true}
                    onError={(e) => handleImageError(0, e)}
                  />
                </div>
              )}
            </Item>
          ) : (
            <div className='grid grid-cols-2 gap-4'>
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`
                  ${
                    images.length === 3 && index === 2
                      ? 'col-span-2'
                      : 'col-span-1'
                  }
                `}
                >
                  <Item
                    original={imageErrors[index] ? '/images/placeholder.jpg' : image}
                    thumbnail={imageErrors[index] ? '/images/placeholder.jpg' : image}
                    width='1000'
                    height='600'
                  >
                    {({ ref, open }) => (
                      <div className="relative h-[400px] w-full">
                        <Image
                          ref={ref}
                          onClick={open}
                          src={imageErrors[index] ? '/images/placeholder.jpg' : image}
                          alt={`Property image ${index + 1}`}
                          fill
                          className='object-cover rounded-xl'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          priority={true}
                          onError={(e) => handleImageError(index, e)}
                        />
                      </div>
                    )}
                  </Item>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Gallery>
  );
};

export default PropertyImages;
