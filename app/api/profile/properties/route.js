import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const properties = await prisma.property.findMany({
      where: {
        ownerId: session.user.id
      },
      include: {
        images: {
          select: {
            id: true
          }
        }
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
    console.error('Error fetching user properties:', error);
    return NextResponse.json(
      { message: 'Error fetching properties' },
      { status: 500 }
    );
  }
} 