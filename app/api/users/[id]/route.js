import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { prisma } from '@/lib/prisma';

// DELETE /api/users/[id]
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Only allow users to delete their own account or admin to delete any account
    if (session.user.id !== id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete user's properties first (if any)
    await prisma.property.deleteMany({
      where: { ownerId: id }
    });

    // Delete user's messages
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: id },
          { recipientId: id }
        ]
      }
    });

    // Delete the user
    const deletedUser = await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'User deleted successfully',
      user: {
        id: deletedUser.id,
        email: deletedUser.email
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Error deleting user' },
      { status: 500 }
    );
  }
} 