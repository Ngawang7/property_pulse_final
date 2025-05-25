import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Get the pathname
    const path = req.nextUrl.pathname;
    
    // Get user's role from token
    const userRole = req.nextauth.token?.role;

    console.log('Middleware - Path:', path);
    console.log('Middleware - User Role:', userRole);

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
      console.log('Checking admin access for path:', path);
      if (userRole !== 'ADMIN') {
        console.log('Access denied - Not an admin');
        return NextResponse.redirect(new URL('/', req.url));
      }
      console.log('Admin access granted');
    }

    // Check for authentication required paths
    if (authRequiredPaths.some(p => path.startsWith(p))) {
      console.log('Auth required path accessed:', path);
      return NextResponse.next();
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
