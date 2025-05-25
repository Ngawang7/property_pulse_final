import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Get the pathname
    const path = req.nextUrl.pathname;
    
    // Get user's role from token
    const userRole = req.nextauth.token?.role;

    // Define protected paths and their allowed roles
    const adminOnlyPaths = ['/admin', '/properties/add', '/properties/.*/edit'];
    const authRequiredPaths = [
      '/profile',
      '/profile/properties',
      '/properties/saved',
      '/messages'
    ];

    // Check for admin only paths
    if (adminOnlyPaths.some(p => path.startsWith(p) || path.match(p))) {
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Check for authentication required paths
    if (authRequiredPaths.some(p => path.startsWith(p))) {
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
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
