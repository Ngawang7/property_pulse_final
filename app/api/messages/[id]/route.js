import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { prisma } from '@/lib/prisma';

// GET /api/messages/:id
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = params;

    const message = await prisma.message.findUnique({
      where: {
        id: id
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        recipient: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    if (!message) {
      return NextResponse.json(
        { message: 'Message Not Found' },
        { status: 404 }
      );
    }

    // Check if user is sender or recipient
    if (message.senderId !== session.user.id && message.recipientId !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // If recipient is viewing, mark as read
    if (message.recipientId === session.user.id && !message.read) {
      await prisma.message.update({
        where: {
          id: id
        },
        data: {
          read: true
        }
      });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Error fetching message' },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/:id
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = params;

    const message = await prisma.message.findUnique({
      where: {
        id: id
      }
    });

    if (!message) {
      return NextResponse.json(
        { message: 'Message Not Found' },
        { status: 404 }
      );
    }

    // Check if user is sender or recipient
    if (message.senderId !== session.user.id && message.recipientId !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.message.delete({
      where: {
        id: id
      }
    });

    return NextResponse.json({ message: 'Message Deleted' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Error deleting message' },
      { status: 500 }
    );
  }
}
