import { prisma } from '@/lib/prisma';

// GET /api/properties/search
export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');
    const listingType = searchParams.get('listingType');

    console.log('Search params:', { location, propertyType, listingType });

    // Build the query
    const where = {};

    // Add listing type to query
    if (listingType && listingType !== 'All') {
      where.listingType = {
        equals: listingType.toUpperCase(),
        mode: 'insensitive'
      };
    }

    // Add property type to query if not 'All'
    if (propertyType && propertyType !== 'All') {
      where.type = {
        equals: propertyType,
        mode: 'insensitive'
      };
    }

    // Add location search
    if (location) {
      where.OR = [
        { location: { equals: location, mode: 'insensitive' } },
        { location: { equals: `"${location}"`, mode: 'insensitive' } }
      ];
    }

    console.log('Where clause:', JSON.stringify(where, null, 2));

    // First, let's check what locations exist in the database
    const allLocations = await prisma.property.findMany({
      select: {
        location: true
      },
      distinct: ['location']
    });
    console.log('Available locations in DB:', allLocations.map(l => l.location));

    const properties = await prisma.property.findMany({
      where,
      include: {
        images: {
          select: {
            id: true,
            filename: true,
          },
        },
        admin: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Found properties:', properties.length);
    if (properties.length > 0) {
      console.log('Sample property location:', properties[0].location);
    }

    return Response.json(
      properties.map(property => ({
        ...property,
        images: property.images.map(img => `/api/images/${img.id}`),
      }))
    );
  } catch (error) {
    console.error('Error searching properties:', error);
    return new Response('Something went wrong', { status: 500 });
  }
};
