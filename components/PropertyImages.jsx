import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';
import { useState, useEffect } from 'react';

const PropertyImages = ({ images }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <Gallery>
      <section className='bg-blue-50 p-4'>
        <div className='container mx-auto'>
          {images.length === 1 ? (
            <Item
              original={images[0]}
              thumbnail={images[0]}
              width='1000'
              height='600'
            >
              {({ ref, open }) => (
                <div className="relative h-[400px] w-full">
                  <Image
                    ref={ref}
                    onClick={open}
                    src={images[0]}
                    alt='Property image'
                    fill
                    className='object-cover rounded-xl'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    priority={true}
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      e.target.src = '/images/placeholder.jpg';
                    }}
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
                    original={image}
                    thumbnail={image}
                    width='1000'
                    height='600'
                  >
                    {({ ref, open }) => (
                      <div className="relative h-[400px] w-full">
                        <Image
                          ref={ref}
                          onClick={open}
                          src={image}
                          alt={`Property image ${index + 1}`}
                          fill
                          className='object-cover rounded-xl'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          priority={true}
                          onError={(e) => {
                            console.error('Error loading image:', e);
                            e.target.src = '/images/placeholder.jpg';
                          }}
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
