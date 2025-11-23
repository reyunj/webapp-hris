import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';
import { hasAccess, getDefaultRoute } from '@/lib/auth/permissions';

export default async function proxy(request: NextRequest) {
  // First, update the session
  const response = await updateSession(request);
  
  // Get the pathname
  const pathname = request.nextUrl.pathname;
  
  // Skip auth check for public routes
  const publicRoutes = ['/login', '/auth/callback', '/'];
  if (publicRoutes.includes(pathname) || pathname.startsWith('/api/')) {
    return response;
  }

  // Check if user has access to the route
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Not authenticated, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Get user's role from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = (profile as any)?.role;

    // Check if user has access to this route
    if (!hasAccess(userRole, pathname)) {
      // Redirect to their default route
      const defaultRoute = getDefaultRoute(userRole);
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }

    return response;
  } catch (error) {
    console.error('Proxy error:', error);
    return response;
  }
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
