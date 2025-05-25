import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { userId } = params;
    console.log('Fetching image for user:', userId);

    if (!userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        image: true,
        imageData: true,
        imageType: true
      }
    });

    if (!user || (!user.image && !user.imageData)) {
      // Return default avatar image
      return new NextResponse('Image not found', { status: 404 });
    }

    // If we have imageData (stored in DB), use that
    if (user.imageData) {
      return new NextResponse(user.imageData, {
        headers: {
          'Content-Type': user.imageType || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    }

    // If we have an image URL, redirect to it
    if (user.image) {
      return NextResponse.redirect(user.image);
    }

    return new NextResponse('Image not found', { status: 404 });
  } catch (error) {
    console.error('Error serving profile image:', error);
    return new NextResponse('Error serving profile image', { status: 500 });
  }
} 