import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Count unread messages for the current user
    const unreadCount = await prisma.message.count({
      where: {
        recipientId: session.user.id,
      read: false,
      },
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return NextResponse.json(
      { message: 'Error getting unread count' },
      { status: 500 }
    );
  }
}
