import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers';
import { access } from 'fs';


// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!path.startsWith("/api/")){

    const access_token = req.cookies.get('access')?.value
    if (!access_token && !path.startsWith('/login') && !path.startsWith('/register')) {
      return Response.redirect(new URL('/login', req.url))
    } else if (access_token && (path.startsWith('/login') || path.startsWith('/register'))){
      return Response.redirect(new URL('/', req.url))
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)', '/api/:path*'],
}