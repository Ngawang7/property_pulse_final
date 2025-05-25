import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/utils/getSessionUser';

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const propertyId = formData.get('propertyId');
    const files = formData.getAll('images');

    if (!propertyId || files.length === 0) {
      return new Response('Property ID and images are required', { status: 400 });
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return new Response('Property not found', { status: 404 });
    }

    // Check if user is admin or property owner
    if (sessionUser.role !== 'ADMIN' && property.adminId !== sessionUser.userId) {
      return new Response('Unauthorized to upload images for this property', { status: 403 });
    }

    const imagePromises = files.map(async (file) => {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      return prisma.image.create({
        data: {
          filename: file.name,
          data: Buffer.from(bytes),
          mimeType: file.type,
          propertyId: propertyId,
        },
      });
    });

    const images = await Promise.all(imagePromises);

    return Response.json({
      message: 'Images uploaded successfully',
      images: images.map(img => ({
        id: img.id,
        filename: img.filename,
      })),
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return new Response('Error uploading images', { status: 500 });
  }
} 