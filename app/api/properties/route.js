import { prisma, checkDatabaseConnection } from '@/lib/prisma';
import { getSessionUser } from '@/utils/getSessionUser';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { NextResponse } from 'next/server';

// GET /api/properties
export const GET = async (request) => {
  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Database connection failed. Please try again later.');
    }

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

    // Get total count with timeout
    const total = await Promise.race([
      prisma.property.count({ where }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 5000)
      )
    ]);
    console.log('API - Total properties:', total);

    // Get properties with pagination and timeout
    const properties = await Promise.race([
      prisma.property.findMany({
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
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 5000)
      )
    ]);

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
    
    // Handle specific database errors
    let errorMessage = 'Failed to fetch properties';
    let statusCode = 500;

    if (error.message.includes('Database connection failed')) {
      errorMessage = 'Database connection failed. Please try again later.';
      statusCode = 503; // Service Unavailable
    } else if (error.message.includes('Database query timeout')) {
      errorMessage = 'Request timed out. Please try again.';
      statusCode = 504; // Gateway Timeout
    } else if (error.message.includes('P1001')) {
      errorMessage = 'Database connection error. Please try again later.';
      statusCode = 503;
    }

    return new NextResponse(
      JSON.stringify({
        message: errorMessage,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
      {
        status: statusCode,
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

    // Handle image uploads
    const imageFiles = formData.getAll('images');
    console.log('API - Number of images:', imageFiles.length);

    // Create property with images
    const property = await prisma.property.create({
      data: {
        ...propertyData,
        owner: {
          connect: {
            id: session.user.id,
          },
        },
        images: {
          create: imageFiles.map(file => ({
            filename: file.name,
            data: file,
            mimeType: file.type,
            size: file.size,
          })),
        },
      },
      include: {
        images: true,
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
