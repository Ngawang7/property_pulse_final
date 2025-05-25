import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return new NextResponse('No image provided', { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new NextResponse('File must be an image', { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Update user profile with new image
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        imageData: buffer,
        imageType: file.type
      }
    });

    return new NextResponse('Profile image updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return new NextResponse('Error uploading profile image', { status: 500 });
  }
} 