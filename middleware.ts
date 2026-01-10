import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Protect admin routes only
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      // Create Supabase client for middleware
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
          },
        }
      )

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      console.error('Middleware error:', error)
      // On error, redirect to login for safety
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
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
}
