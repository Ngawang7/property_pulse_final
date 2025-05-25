import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export const POST = async (request) => {
  try {
    const { email, username, password, adminCode } = await request.json();

    // Validate fields
    if (!email || !username || !password || !adminCode) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Validate admin code
    if (adminCode !== process.env.ADMIN_CODE) {
      return new Response('Invalid admin code', { status: 401 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      return new Response('User already exists', { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
      },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.log('Error in create admin route:', error);
    return new Response('Something went wrong', { status: 500 });
  }
}; 