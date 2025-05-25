import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/utils/getSessionUser';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { NextResponse } from 'next/server';
import { uploadImages } from '@/utils/cloudinary';

// GET /api/properties
export const GET = async (request) => {
  try {
    console.log('API - Fetching properties');
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 6;
    const listingType = searchParams.get('listingType');
    const type = searchParams.get('type');

    console.log('API - Query params:', { page, pageSize, listingType, type });

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where = {};
    if (listingType) {
      where.listingType = listingType.toUpperCase();
    }
    if (type) {
      where.type = type;
    }

    console.log('API - Where clause:', where);

    // Get total count
    const total = await prisma.property.count({ where });
    console.log('API - Total properties:', total);

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

    console.log('API - Properties fetched:', properties.length);

    return new NextResponse(
      JSON.stringify({
        total,
        properties: properties.map(property => ({
          ...property,
          images: property.images.map(img => `/api/images/${img.id}`),
        })),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('API - Error fetching properties:', error);
    return new NextResponse(
      JSON.stringify({
        message: 'Failed to fetch properties',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
};

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('API - Session:', session);

    if (!session) {
      console.log('API - No session found');
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      console.log('API - User is not admin');
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    console.log('API - Form data received');

    // Parse nested JSON fields
    const location = JSON.parse(formData.get('location'));
    const amenities = JSON.parse(formData.get('amenities'));
    const rates = JSON.parse(formData.get('rates'));
    const seller_info = JSON.parse(formData.get('seller_info'));

    // Create property data object
    const propertyData = {
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      location: location,
      beds: parseInt(formData.get('beds')),
      baths: parseInt(formData.get('baths')),
      square_feet: parseInt(formData.get('square_feet')),
      amenities: amenities,
      rates: rates,
      sellerName: seller_info.name,
      sellerEmail: seller_info.email,
      sellerPhone: seller_info.phone,
      adminId: session.user.id,
    };

    console.log('API - Property data:', propertyData);

    // Upload images to Cloudinary
    const imageFiles = formData.getAll('images');
    console.log('API - Number of images:', imageFiles.length);

    if (imageFiles.length > 0) {
      const uploadedImages = await uploadImages(imageFiles);
      propertyData.images = uploadedImages;
    }

    // Create property in database
    const property = await prisma.property.create({
      data: {
        ...propertyData,
        owner: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    console.log('API - Property created successfully:', property);

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('API - Error creating property:', error);
    return NextResponse.json(
      { message: error.message || 'Error creating property' },
      { status: 500 }
    );
  }
}
