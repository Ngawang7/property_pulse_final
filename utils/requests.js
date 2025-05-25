const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || 'http://localhost:3000';

// Fetch all properties
async function fetchProperties({ showFeatured = false } = {}) {
  try {
    const res = await fetch(
      `${apiDomain}/api/properties${showFeatured ? '/featured' : ''}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();
    return data.properties || []; // Return the properties array or empty array if not found
  } catch (error) {
    console.log(error);
    return [];
  }
}

// Fetch single property
async function fetchProperty(id) {
  try {
    const res = await fetch(`${apiDomain}/api/properties/${id}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch property');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
}

export { fetchProperties, fetchProperty };
