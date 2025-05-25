import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const imageId = params.id;

    if (!imageId) {
      return new Response('Image ID is required', { status: 400 });
    }

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return new Response('Image not found', { status: 404 });
    }

    // Return the image with proper headers
    return new Response(image.data, {
      headers: {
        'Content-Type': image.mimeType,
        'Content-Length': image.data.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new Response('Error serving image', { status: 500 });
  }
} 