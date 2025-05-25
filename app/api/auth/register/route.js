import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export const POST = async (request) => {
  try {
    const { email, username, password, password2 } = await request.json();

    // Validate fields
    if (!email || !username || !password || !password2) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return new Response('Password must be at least 6 characters', {
        status: 400,
      });
    }

    // Validate password match
    if (password !== password2) {
      return new Response('Passwords do not match', { status: 400 });
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

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username ? username.toLowerCase() : null,
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.log('Error in register route:', error);
    return new Response('Something went wrong', { status: 500 });
  }
}; 