import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;
    
    console.log('Middleware - Path:', path);
    console.log('Middleware - Token:', token);

    // If no token, redirect to sign in
    if (!token) {
      console.log('No token found, redirecting to sign in');
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Check for admin routes
    if (path.startsWith('/properties/add') || path.startsWith('/admin')) {
      console.log('Checking admin access for:', path);
      if (token.role !== 'ADMIN') {
        console.log('Access denied - Not an admin');
        return NextResponse.redirect(new URL('/', req.url));
      }
      console.log('Admin access granted');
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('Auth callback - Token:', token);
        return !!token;
      }
    },
  }
);

// Specify which routes to protect
export const config = {
  matcher: [
    '/admin/:path*',
    '/properties/add',
    '/properties/:id/edit',
    '/profile/:path*',
    '/properties/saved',
    '/messages/:path*'
  ]
};
