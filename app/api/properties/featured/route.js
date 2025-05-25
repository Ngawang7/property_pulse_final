import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/properties/featured
export const GET = async (request) => {
  try {
    const properties = await prisma.property.findMany({
      where: {
        is_featured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return new Response(JSON.stringify(properties), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};
