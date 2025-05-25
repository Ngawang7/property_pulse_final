import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const GET = async (request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Not authenticated', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return new Response('Property ID is required', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        bookmarks: true,
      },
    });

    const isBookmarked = user.bookmarks.some(bookmark => bookmark.id === propertyId);

    return new Response(JSON.stringify({ isBookmarked }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
