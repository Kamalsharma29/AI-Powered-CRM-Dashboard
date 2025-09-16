import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createRateLimiter } from '@/lib/security-config';

// Create rate limiter instance
const rateLimiter = createRateLimiter();

// Protected routes that require authentication
const protectedRoutes = [
  '/',
  '/dashboard',
  '/leads',
  '/ai-email',
  '/analytics',
  '/settings',
  '/api/leads',
  '/api/users',
  '/api/analytics',
  '/api/ai',
];

// Admin-only routes
const adminRoutes = [
  '/settings',
  '/api/users',
];

// API routes that need rate limiting
const rateLimitedRoutes = [
  '/api/auth',
  '/api/leads',
  '/api/users',
  '/api/ai',
  '/api/analytics',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Temporarily disable CSP for debugging
  // response.headers.set(
  //   'Content-Security-Policy',
  //   "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
  // );

  // Rate limiting for API routes
  if (rateLimitedRoutes.some(route => pathname.startsWith(route))) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const identifier = `${ip}-${pathname}`;
    
    if (!rateLimiter.isAllowed(identifier)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests', 
          message: 'Rate limit exceeded. Please try again later.' 
        }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '900' // 15 minutes
          } 
        }
      );
    }
  }

  // Authentication check for protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      // Redirect to sign-in page for web routes
      if (!pathname.startsWith('/api/')) {
        const signInUrl = new URL('/auth/signin', request.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
      }
      
      // Return 401 for API routes
      return new NextResponse(
        JSON.stringify({ 
          error: 'Unauthorized', 
          message: 'Authentication required' 
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Admin-only route check
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (token.role !== 'admin') {
        // Redirect to dashboard for web routes
        if (!pathname.startsWith('/api/')) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        
        // Return 403 for API routes
        return new NextResponse(
          JSON.stringify({ 
            error: 'Forbidden', 
            message: 'Admin access required' 
          }),
          { 
            status: 403, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth/')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};