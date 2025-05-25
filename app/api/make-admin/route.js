import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: `No user found with email: ${email}` },
        { status: 404 }
      );
    }

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        role: 'ADMIN',
      },
    });

    return NextResponse.json({
      message: 'User role updated to ADMIN successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { 
        message: error.message || 'Error updating user role',
        details: error.meta?.cause || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 