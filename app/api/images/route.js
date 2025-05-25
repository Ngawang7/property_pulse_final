import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

// Maximum image size (5MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { message: 'Image size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid image type. Allowed types: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Process image with sharp
    const buffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();

    // Optimize image
    const optimizedImage = await sharp(imageBuffer)
      .resize(1200, 1200, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .toBuffer();

    // Create image record in database
    const image = await prisma.image.create({
      data: {
        filename: file.name,
        data: optimizedImage,
        mimeType: 'image/jpeg',
        size: optimizedImage.length,
        width: metadata.width,
        height: metadata.height,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { message: 'Error uploading image' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Image ID is required' },
        { status: 400 }
      );
    }

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { message: 'Image not found' },
        { status: 404 }
      );
    }

    return new NextResponse(image.data, {
      headers: {
        'Content-Type': image.mimeType,
        'Cache-Control': 'public, max-age=31536000',
        'Content-Length': image.size.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { message: 'Error fetching image' },
      { status: 500 }
    );
  }
} 