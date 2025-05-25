import { getSessionUser } from '@/utils/getSessionUser';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    console.log('Session user:', sessionUser);

    if (!sessionUser || !sessionUser.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return new Response('No image provided', { status: 400 });
    }

    // Convert image to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log('Uploading image:', {
      userId: sessionUser.userId,
      imageType: image.type,
      bufferSize: buffer.length
    });

    // Update user's profile image
    const updatedUser = await prisma.user.update({
      where: {
        id: sessionUser.userId
      },
      data: {
        image: buffer,
        imageType: image.type
      }
    });

    console.log('User updated successfully:', {
      userId: updatedUser.id,
      hasImage: !!updatedUser.image
    });

    return Response.json({ 
      message: 'Profile image updated successfully',
      userId: updatedUser.id
    });
  } catch (error) {
    console.error('Error uploading profile image:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return new Response(error.message || 'Error uploading profile image', { status: 500 });
  }
} 