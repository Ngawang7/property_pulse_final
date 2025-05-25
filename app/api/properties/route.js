import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/utils/getSessionUser';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

// GET /api/properties
export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 6;
    const listingType = searchParams.get('listingType');
    const type = searchParams.get('type');

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where = {};
    if (listingType) {
      where.listingType = listingType.toUpperCase();
    }
    if (type) {
      where.type = type;
    }

    // Get total count
    const total = await prisma.property.count({ where });

    // Get properties with pagination
    const properties = await prisma.property.findMany({
      where,
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        location: true,
        price: true,
        listingType: true,
        sellerName: true,
        sellerEmail: true,
        sellerPhone: true,
        images: {
          select: {
            id: true,
            filename: true,
          },
        },
        admin: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json({
      total,
      properties: properties.map(property => ({
        ...property,
        images: property.images.map(img => `/api/images/${img.id}`),
      })),
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return Response.json(
      { error: 'Failed to fetch properties', details: error.message },
      { status: 500 }
    );
  }
};

export const POST = async (request) => {
  try {
    // Get both session methods for debugging
    const sessionUser = await getSessionUser();
    const directSession = await getServerSession(authOptions);

    console.log('Direct Session:', JSON.stringify(directSession, null, 2));
    console.log('Session User:', JSON.stringify(sessionUser, null, 2));

    if (!sessionUser || !sessionUser.userId) {
      console.log('No session user found');
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: sessionUser.userId },
      select: { role: true }
    });

    console.log('Database User:', JSON.stringify(dbUser, null, 2));

    // Check if user is admin
    console.log('Session User Role:', sessionUser.role);
    console.log('Database User Role:', dbUser?.role);
    
    if (dbUser?.role !== 'ADMIN') {
      console.log('User is not admin');
      return Response.json(
        { error: 'Only administrators can add properties' },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    // Log form data for debugging
    console.log('Form Data:', Object.fromEntries(formData.entries()));

    // Handle amenities: parse if it's a JSON string
    let amenities = formData.getAll('amenities') || [];
    if (amenities.length === 1 && typeof amenities[0] === 'string' && amenities[0].startsWith('[')) {
      try {
        amenities = JSON.parse(amenities[0]);
      } catch (e) {
        console.error('Failed to parse amenities:', amenities[0], e);
        amenities = [];
      }
    }

    // Get all form data with validation
    const propertyData = {
      name: formData.get('name') || '',
      type: formData.get('type') || '',
      description: formData.get('description') || '',
      listingType: (formData.get('listingType') || 'SALE').toUpperCase(),
      status: formData.get('status') || 'For Sale',
      location: formData.get('location') || '',
      price: parseFloat(formData.get('price')) || 0,
      sellerName: formData.get('sellerName') || '',
      sellerEmail: formData.get('sellerEmail') || '',
      sellerPhone: formData.get('sellerPhone') || '',
      adminId: sessionUser.userId,
    };

    // Validate required fields
    if (!propertyData.name || !propertyData.type || !propertyData.listingType) {
      return Response.json(
        { error: 'Name, type, and listing type are required' },
        { status: 400 }
      );
    }

    console.log('Property Data:', propertyData);

    // Create property
    try {
      const property = await prisma.property.create({
        data: propertyData,
      });
      console.log('Property created successfully:', property);

      // Handle image uploads
      const images = formData.getAll('images').filter(image => image.name !== '');
      
      if (images.length > 0) {
        const imagePromises = images.map(async (image) => {
          const buffer = await image.arrayBuffer();
          const bytes = new Uint8Array(buffer);

          return prisma.image.create({
            data: {
              filename: image.name,
              data: Buffer.from(bytes),
              mimeType: image.type,
              propertyId: property.id,
            },
          });
        });

        await Promise.all(imagePromises);
      }

      // Fetch the created property with its images and seller info
      const createdProperty = await prisma.property.findUnique({
        where: { id: property.id },
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
          location: true,
          price: true,
          listingType: true,
          sellerName: true,
          sellerEmail: true,
          sellerPhone: true,
          images: {
            select: {
              id: true,
              filename: true,
            },
          },
          admin: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      });

      return Response.json({
        message: 'Property created successfully',
        property: {
          ...createdProperty,
          images: createdProperty.images.map(img => `/api/images/${img.id}`),
        },
      });
    } catch (error) {
      console.error('Prisma error creating property:', error);
      return Response.json(
        { error: 'Failed to create property', details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating property:', error);
    return Response.json(
      { error: 'Failed to add property', details: error.message },
      { status: 500 }
    );
  }
};
