import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/utils/getSessionUser';
import { NextResponse } from 'next/server';

// GET /api/properties/:id
export async function GET(request, { params }) {
  try {
    const propertyId = params.id;

    if (!propertyId) {
      return NextResponse.json(
        { message: 'Property ID is required' },
        { status: 400 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
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
        images: true,
        admin: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      );
    }

    // Transform image data to URLs
    const propertyWithImageUrls = {
      ...property,
      images: property.images.map(img => `/api/images/${img.id}`)
    };

    return NextResponse.json(propertyWithImageUrls);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { message: 'Error fetching property' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/:id
export async function DELETE(request, { params }) {
  try {
    const propertyId = params.id;

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get property to check ownership
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { adminId: true }
    });

    if (!property) {
      return new Response('Property Not Found', { status: 404 });
    }

    // Check if user is admin
    if (sessionUser.role !== 'ADMIN') {
      return new Response('Unauthorized', { status: 401 });
    }

    // Delete the property (this will also delete associated images due to cascade delete)
    await prisma.property.delete({
      where: { id: propertyId }
    });

    return Response.json({ message: 'Property Deleted Successfully' });
  } catch (error) {
    console.log(error);
    return new Response('Something Went Wrong', { status: 500 });
  }
}

// PUT /api/properties/:id
export async function PUT(request, { params }) {
  try {
    const propertyId = params.id;
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get property to check ownership
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true }
    });

    if (!existingProperty) {
      return new Response('Property Not Found', { status: 404 });
    }

    // Check if user is owner or admin
    if (existingProperty.ownerId !== sessionUser.userId && sessionUser.role !== 'ADMIN') {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();

    // Get form data
    const propertyData = {
      type: formData.get('type') || '',
      name: formData.get('name') || '',
      description: formData.get('description') || '',
      listingType: (formData.get('listingType') || 'SALE').toUpperCase(),
      location: formData.get('location') || '',
      price: parseFloat(formData.get('price')) || 0,
      sellerName: formData.get('sellerName') || '',
      sellerEmail: formData.get('sellerEmail') || '',
      sellerPhone: formData.get('sellerPhone') || '',
    };

    // Update property
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: propertyData,
      include: {
        images: true,
        admin: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    return Response.json(updatedProperty);
  } catch (error) {
    console.log(error);
    return new Response('Something Went Wrong', { status: 500 });
  }
}
