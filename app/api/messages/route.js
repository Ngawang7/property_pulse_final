import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/messages
export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify('Not authenticated'), {
        status: 401,
      });
    }

    const readMessages = await prisma.message.findMany({
      where: {
        recipientId: session.user.id,
        read: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: {
          select: {
            username: true,
          },
        },
        property: {
          select: {
            name: true,
          },
        },
      },
    });

    const unreadMessages = await prisma.message.findMany({
      where: {
        recipientId: session.user.id,
        read: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sender: {
          select: {
            username: true,
          },
        },
        property: {
          select: {
            name: true,
          },
        },
      },
    });

    const messages = [...unreadMessages, ...readMessages];

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};

// POST /api/messages
export const POST = async (request) => {
  try {
    const { name, email, phone, message, property, recipient } =
      await request.json();

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: 'You must be logged in to send a message' }),
        { status: 401 }
      );
    }

    // Can not send message to self
    if (session.user.id === recipient) {
      return new Response(
        JSON.stringify({ message: 'Can not send a message to yourself' }),
        { status: 400 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId: recipient,
        propertyId: property,
        name,
        email,
        phone,
        body: message,
      },
    });

    return new Response(JSON.stringify({ message: 'Message Sent' }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
