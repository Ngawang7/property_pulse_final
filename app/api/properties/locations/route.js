import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get unique locations from properties
    const locations = await prisma.property.findMany({
      select: {
        location: true,
      },
      distinct: ['location'],
      orderBy: {
        location: 'asc',
      },
    });

    // Extract just the location strings and remove quotes
    const locationList = locations.map(loc => loc.location.replace(/"/g, ''));

    return Response.json(locationList);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return new Response('Error fetching locations', { status: 500 });
  }
} 