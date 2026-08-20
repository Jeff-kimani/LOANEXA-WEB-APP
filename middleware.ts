import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Allow unauthenticated access to the dedicated underwriter login URL
  if (pathname === '/underwriter/login') {
    if (user) {
      return NextResponse.redirect(new URL('/underwriter', request.url));
    }
    return response;
  }

  // Intercept all other underwriter sub-routes
  if (pathname.startsWith('/underwriter') && !user) {
    return NextResponse.redirect(new URL('/underwriter/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/underwriter/:path*'],
};
