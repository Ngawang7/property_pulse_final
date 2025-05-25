import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/properties/user/:userId
export async function GET(request, { params }) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    const properties = await prisma.property.findMany({
      where: {
        ownerId: userId
      },
      include: {
        images: {
          select: {
            id: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the properties to include image URLs
    const propertiesWithImageUrls = properties.map(property => ({
      ...property,
      images: property.images.map(img => `/api/images/${img.id}`)
    }));

    return NextResponse.json(propertiesWithImageUrls);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { message: 'Error fetching properties' },
      { status: 500 }
    );
  }
}
