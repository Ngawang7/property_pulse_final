import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/utils/getSessionUser';

export const dynamic = 'force-dynamic';

// GET /api/bookmarks
export async function GET() {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', { status: 401 });
    }

    // Get user's bookmarked properties
    const bookmarkedProperties = await prisma.property.findMany({
      where: {
        bookmarkedBy: {
          some: {
            id: sessionUser.userId
          }
        }
      },
      include: {
        images: {
          select: {
            id: true,
          }
        },
      }
    });

    // Transform the properties to include image URLs
    const propertiesWithImageUrls = bookmarkedProperties.map(property => ({
      ...property,
      images: property.images.map(img => `/api/images/${img.id}`)
    }));

    return Response.json(propertiesWithImageUrls);
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
}

// POST /api/bookmarks
export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', { status: 401 });
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return new Response('Property ID is required', { status: 400 });
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return new Response('Property not found', { status: 404 });
    }

    // Check if property is already bookmarked
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.userId },
      include: {
        bookmarks: true
      }
    });

    const isBookmarked = user.bookmarks.some(bookmark => bookmark.id === propertyId);

    if (isBookmarked) {
      // Remove bookmark
      await prisma.user.update({
        where: { id: sessionUser.userId },
        data: {
          bookmarks: {
            disconnect: {
              id: propertyId
            }
          }
        }
      });

      return Response.json({ message: 'Bookmark removed' });
    }

    // Add bookmark
    await prisma.user.update({
      where: { id: sessionUser.userId },
      data: {
        bookmarks: {
          connect: {
            id: propertyId
          }
        }
      }
    });

    return Response.json({ message: 'Bookmark added' });
  } catch (error) {
    console.log('Error:', error);
    return new Response('Something went wrong', { status: 500 });
  }
}
