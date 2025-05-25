import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
          },
          select: {
            id: true,
            email: true,
            username: true,
            password: true,
            role: true,
          },
        });

        if (!user || !user.password) {
          console.log('User not found or no password');
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          console.log('Invalid password');
          throw new Error('Invalid credentials');
        }

        console.log('User authenticated successfully:', user.email);
        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log('JWT Callback - Token:', token);
      console.log('JWT Callback - User:', user);
      
      if (trigger === 'update' && session) {
        console.log('JWT Callback - Updating token with session:', session);
        return { ...token, ...session.user };
      }
      
      if (user) {
        console.log('JWT Callback - Adding user data to token');
        return {
          ...token,
          id: user.id,
          role: user.role,
          name: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Token:', token);
      console.log('Session Callback - Session:', session);
      
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
};
