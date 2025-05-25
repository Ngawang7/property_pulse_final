const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || 'http://localhost:3000';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Fetch all properties
async function fetchProperties({ showFeatured = false } = {}) {
  try {
    const res = await fetch(
      `${apiDomain}/api/properties${showFeatured ? '/featured' : ''}`,
      { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch properties');
    }

    const data = await res.json();
    return data.properties || []; // Return the properties array or empty array if not found
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
}

// Fetch single property with retry logic
async function fetchProperty(id, retries = MAX_RETRIES) {
  try {
    const res = await fetch(`${apiDomain}/api/properties/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }, // Disable caching
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch property');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (retries > 0 && (
      error.message.includes('Failed to fetch') || 
      error.message.includes('NetworkError') ||
      error.message.includes('timeout') ||
      error.message.includes('Database connection failed') ||
      error.message.includes('Database query timeout')
    )) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchProperty(id, retries - 1);
    }
    console.error('Error fetching property:', error);
    throw error;
  }
}

export { fetchProperties, fetchProperty };
